const Redis = require('ioredis')

const connectRedis = () => {
    const redis = new Redis() 
    redis.on('connect', () => console.log('Redis connected')) 
    return redis
}

module.exports= connectRedis