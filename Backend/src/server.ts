import express from 'express'
import { serverconfig } from './config/server.config'
import { generalErrorMiddleware } from './middlewares/error.middlware'
import { DbConnect } from './config/dbconfig';
import authRouter from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import { initRedis } from './config/redisConfig';
const app = express()

app.use(express.json());

app.use(cookieParser())

app.use('/api',authRouter)

app.use(generalErrorMiddleware);

app.listen(serverconfig.PORT, async()=>{
    console.log(`Server is running on ${serverconfig.PORT}`);

    await DbConnect()
    await initRedis()
})