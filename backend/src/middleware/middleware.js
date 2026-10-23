const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../config/redis");

async function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (await isTokenBlacklisted(token)) {
            return res.status(401).json({ message: "Authentication token has been revoked" });
        }
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid authentication token" });
        }
        console.error("Token blacklist check failed:", error.message);
        return res.status(503).json({ message: "Authentication service is unavailable" });
    }

    req.user=decoded;
    next();
}

module.exports=authenticate;