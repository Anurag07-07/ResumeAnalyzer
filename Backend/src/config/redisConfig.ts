import { serverconfig } from './server.config'
import Redis from 'ioredis'



function connectionRedis(){
    try{
     let connection:Redis;
   
     return () => {
      if(!connection){
      connection = new Redis({
        port:serverconfig.REDIS_PORT,
        host:serverconfig.REDIS_HOST
      })
      return connection;
      }
  }
     
    }catch(error){
       console.log("Redis Connection Error:", error);
       throw error;
    }
}

export const getredisconnection = connectionRedis();