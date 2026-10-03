import dotenv from 'dotenv'
type Port = {
    PORT:number
}

function run(){
dotenv.config()
}
run()

export const serverconfig:Port = {
    PORT: Number(process.env.PORT) || 8080
}