import { createClient } from "redis";
import { serverconfig } from "./server.config";

export const redisClient=createClient({
  url:serverconfig.REDIS_URL
})

redisClient.on('error',(err)=>{
  console.log("Redis error",err);
})

redisClient.on('connect',()=>{
  console.log("Redis connected");
})

export async function initRedis() {
  try{
    if(!redisClient.isOpen){
      await redisClient.connect();
    }
  }catch(err){
    console.log("Redis connection error",err);
    throw err;
  }
}

export async function closeRedis() {
  await redisClient.quit();
}