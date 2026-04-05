const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_URL,  {tls: {},  // explicitly enable TLS
  maxRetriesPerRequest: 5, // optional: reduce retry attempts
  reconnectOnError: () => true,});
redis.on('error', (err) => {
  console.error('Redis error:', err);
});
module.exports = redis;