import dotenv from 'dotenv'
type Port = {
    PORT:number
    MONGO_URI:string
}

function run(){
dotenv.config()
}
run()

export const serverconfig:Port = {
    PORT: Number(process.env.PORT) || 8080,
    MONGO_URI : process.env.MONGO_URI || "mongodb://localhost:27017"  
}