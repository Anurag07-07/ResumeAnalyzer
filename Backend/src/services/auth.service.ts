import { serverconfig } from "../config/server.config";
import { ResponseDTO, UserDTO } from "../dtos/user.dto";
import { createUser, loginUser } from "../repositories/auth.repositiory";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { blacklistToken } from "../repositories/cache.repository";

export async function signupservice(data: UserDTO): Promise<ResponseDTO> {
    try {
        const user = await createUser(data);
        const token = jwt.sign(
            { id: user._id, username: user.username },
            serverconfig.JWT_SECRET,
            { expiresIn: "1d" }
        )
        const info:ResponseDTO={
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
            },
            token
        }
        return info;
        
    } catch (error) {
        throw error;
    }
}

export async function signinservice(data: UserDTO):Promise<ResponseDTO> {
    try {
        const userinfo = await loginUser(data.email);

        if (!userinfo) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(data.password, userinfo.password)

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            { id: userinfo._id, username: userinfo.username },
            serverconfig.JWT_SECRET,
            { expiresIn: "1d" }
        )

        const info:ResponseDTO={
            user:{
                _id:userinfo._id,
                username:userinfo.username,
                email:userinfo.email,
            },
            token
        }

        return info;
    }catch(error){
        throw new Error("Internal Server Error");
    }
}


export async function logoutservice(token:string,exp:number|undefined) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const remainingTime = exp ? exp - nowInSeconds : 0;

    if(remainingTime>0){
        await blacklistToken(token,remainingTime);
    }
}