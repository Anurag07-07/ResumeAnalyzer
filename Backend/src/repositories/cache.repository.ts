import { redisClient } from "../config/redisConfig";
import { serverconfig } from "../config/server.config";

export async function ensureConnection():Promise<void>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
}

export async function blacklistToken(token:string,ttlInSeconds:number) {
    await ensureConnection();

    const key=`${serverconfig.REDIS_BLACKLIST}${token}`
    
    await redisClient.set(key,'true',{
        EX:ttlInSeconds
    });
}

export async function isTokenBlacklisted(token:string):Promise<boolean> {
    await ensureConnection();

    const key = `${serverconfig.REDIS_BLACKLIST}${token}`;

    const exists=await redisClient.exists(key);

    return exists===1;
}