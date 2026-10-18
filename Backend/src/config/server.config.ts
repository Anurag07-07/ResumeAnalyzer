import dotenv from 'dotenv'
type Port = {
    PORT: number
    MONGO_URI: string,
    JWT_SECRET: string,
    SALTROUNDS: number,
    REDIS_URL:string,
    REDIS_BLACKLIST:string,
    GEMINI_KEY:string
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
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    REDIS_BLACKLIST:process.env.REDIS_BLACKLIST || "resume_counter",
    GEMINI_KEY: process.env.GOOGLE_GEMINI_KEY || ""
}