import { serverconfig } from "../config/server.config";
import { ResponseDTO, UserDTO } from "../dtos/user.dto";
import { createUser, loginUser } from "../repositories/auth.repositiory";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

export async function signupservice(data: UserDTO): Promise<ResponseDTO> {
    try {
        const user = await createUser(data);
        const token = jwt.sign(
            { id: user._id, username: user.username },
            serverconfig.JWT_SECRET,
            { expiresIn: "1d" }
        )
        return {
            user, token
        }
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
                username:userinfo.password,
                email:userinfo.email,
            },
            token
        }

        return info;
    }catch(error){
        throw new Error("Internal Server Error");
    }
}


export async function logoutservice(id: string | undefined) {
    
}