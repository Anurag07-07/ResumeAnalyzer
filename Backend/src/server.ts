import express from 'express'
import { serverconfig } from './config/server.config'
import { generalErrorMiddleware } from './middlewares/error.middlware'
const app = express()

app.use(express.json());



app.use(generalErrorMiddleware);

app.listen(serverconfig.PORT, ()=>{
    console.log(`Server is running on ${serverconfig.PORT}`);
    
})