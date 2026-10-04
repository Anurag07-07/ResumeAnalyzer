import dotenv from 'dotenv'
type Port = {
    PORT: number
    MONGO_URI: string,
    JWT_SECRET: string,
    SALTROUNDS: number,
    REDIS_PORT:number,
    REDIS_HOST:string
}

function run() {
    dotenv.config()
}
run()

export const serverconfig: Port = {
    PORT: Number(process.env.PORT) || 8080,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
    JWT_SECRET: process.env.JWT_SECRET || "secretkey",
    SALTROUNDS: Number(process.env.SALTROUNDS) || 10,
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_HOST: process.env.REDIS_HOST || "localhost"
}