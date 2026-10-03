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
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    deletedAt:{
        type:Date,
        default:null    
    }
},{timestamps:true})

export default mongoose.model<userSchema>('users',UserSchema)