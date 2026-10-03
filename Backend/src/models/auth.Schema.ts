import mongoose, { Document } from "mongoose";

export interface userSchema extends Document{
    username:string
    password:string
    email:string
    createdAt?:Date
    updatedAt?:Date
    deletedAt?:Date | null  
}

const UserSchema = new mongoose.Schema<userSchema>({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    deletedAt:{
        type:Date,
        default:null    
    }
},{timestamps:true})

export const User= mongoose.model<userSchema>('User',UserSchema)