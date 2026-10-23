require('dotenv').config();
const app=require('./src/app');
const connectDB=require('./src/database/db');
const { connectRedis } = require('./src/config/redis');

const startServer = async () => {
  await connectDB();
  await connectRedis();
  console.log('Redis database connected');

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exitCode = 1;
});