const crypto = require("crypto");
const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || process.env.host;
const redisPort = process.env.REDIS_PORT || process.env.port;
const redisPassword = process.env.REDIS_PASSWORD || process.env.password;
const redisProtocol = process.env.REDIS_TLS === "true" ? "rediss" : "redis";
const redisUrl = process.env.REDIS_URL || (
  redisHost && redisPort && redisPassword
    ? `${redisProtocol}://default:${encodeURIComponent(redisPassword)}@${redisHost}:${redisPort}`
    : "redis://127.0.0.1:6379"
);

const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", (error) => {
  console.error("Redis client error:", error.message);
});

let connectionPromise;

const connectRedis = async () => {
  if (!connectionPromise) {
    connectionPromise = redisClient.connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
};

const getTokenKey = (token) => (
  `auth:blacklist:${crypto.createHash("sha256").update(token).digest("hex")}`
);

const isTokenBlacklisted = async (token) => {
  await connectRedis();
  return (await redisClient.exists(getTokenKey(token))) === 1;
};

const blacklistToken = async (token, expiresAt) => {
  const ttlInSeconds = Math.ceil(expiresAt - Date.now() / 1000);
  if (ttlInSeconds <= 0) {
    return;
  }

  await connectRedis();
  await redisClient.set(getTokenKey(token), "1", { EX: ttlInSeconds });
};

module.exports = { blacklistToken, connectRedis, isTokenBlacklisted };
