import Redis from 'ioredis'

let client: Redis.Redis;

export function redis() {
    if(!client) {
        client = new Redis(process.env.REDIS_URL)
    }

    return client
}
