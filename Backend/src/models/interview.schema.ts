import mongoose from 'mongoose'
import { Schema } from 'mongoose'
export enum Severnity{
    low = "low",
    medium = "medium",
    high = "high"
}
export interface ITechinalQuestion{
    question:string
    intention:string
    answer:string
}

export interface IBehaviouralQuestion{
    question:string
    intention:string
    answer:string
}

export interface ISkill{
    skill:string
    severnity:Severnity 
}

export interface IPreparation{
    tasks:string
}

export interface IInterview extends Document{
    jobDescription:string
    resume?:string
    selfDescription:string
    matchScore?:number 
    technicalQuestion:ITechinalQuestion[]
    behaviouralQuestion:IBehaviouralQuestion[]
    skillGap:ISkill[]
    preparationPlan:IPreparation[]
    user:mongoose.Types.ObjectId
}

export const technicalQuestionSchema = new Schema<ITechinalQuestion>({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{
    _id:false
})

export const behviouralQuestionSchema = new Schema<IBehaviouralQuestion>({
    question:{
        type:String,
        required:true
    },
    intention:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
},{
    _id:false
})

export const skillSchema = new Schema<ISkill>({
    skill:{
        type:String,
        required:true
    },
    severnity:{
        type:String,
        enum:Object.values(Severnity),
        required:true
    }},
    {
    _id:false
    })


export const preparationSchema = new Schema<IPreparation>({
    tasks:{
        type:String 
    },
    
},{_id:false})    

const intreviewSchema = new Schema<IInterview>(
    {
        jobDescription:{type:String},
        resume:{type:String},
        selfDescription:{type:String},
        matchScore:{
            type:Number,
            min:0,
            max:100 
        },
        technicalQuestion:[technicalQuestionSchema],
        behaviouralQuestion:[behviouralQuestionSchema],
        skillGap:[skillSchema], 
        preparationPlan:[preparationSchema],
        user:{
            type:mongoose.Types.ObjectId,
            ref:"Users"
        }  
    },
    {
        timestamps:true
    }
)


export default mongoose.model<IInterview>("Interview",intreviewSchema)
