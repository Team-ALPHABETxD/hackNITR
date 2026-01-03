const Redis = require('ioredis')

const connectRedis = () => {
    const redis = new Redis({
        host: "redis",
        port: 6379
    })
    redis.on('connect', () => console.log('Redis connected'))
    return redis
}

module.exports = connectRedis