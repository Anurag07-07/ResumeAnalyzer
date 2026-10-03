import mongoose from 'mongoose'
import { serverconfig } from './server.config'
export async function DbConnect() {
    try{
        await mongoose.connect(serverconfig.MONGO_URI)
        console.log(`Database Connected`);
    }catch(err){
        console.log(`Database Not Connected`);
        process.exit(1)
    }
}