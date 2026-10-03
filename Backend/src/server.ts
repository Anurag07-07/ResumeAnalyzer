import express from 'express'
import { serverconfig } from './config/server.config'
const app = express()


app.listen(serverconfig.PORT, ()=>{
    console.log(`Server is running on ${serverconfig.PORT}`);
    
})