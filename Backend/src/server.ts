import express from 'express'
import { serverconfig } from './config/server.config'
import { generalErrorMiddleware } from './middlewares/error.middlware'
import { DbConnect } from './config/dbconfig';
import authRouter from './routes/auth.routes';
const app = express()

app.use(express.json());

app.use('/api',authRouter)

app.use(generalErrorMiddleware);

app.listen(serverconfig.PORT, async()=>{
    console.log(`Server is running on ${serverconfig.PORT}`);

    await DbConnect()
})