import { Types } from "mongoose"

export type UserDTO = {
    username:string
    password:string
    email:string
}

export type CreateUserDTO={
    _id:Types.ObjectId
    username:string
    email:string
}

export type ResponseDTO={
    user:CreateUserDTO
    token:string
}

export type LoginResponseDTO={
    _id:Types.ObjectId
    username:string
    email:string
    password:string
}