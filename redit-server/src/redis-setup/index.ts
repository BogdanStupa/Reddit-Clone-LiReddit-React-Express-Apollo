import redis from 'redis';


const RedisClient = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});

RedisClient.on('connect', () => {
    console.log('Client connected to redis...')
})

RedisClient.on('ready', () => {
    console.log('Client connected to redis and ready to use...')
})

RedisClient.on('error', (err) => {   
    console.log(err.message)
})

RedisClient.on('end', () => {
    console.log('Client disconnected from redis')
})

export { RedisClient };