import { Request, Response } from "express";
import { signupservice } from "../services/auth.service";


export async function signup(req:Request, res: Response){
    try {
        const response = await signupservice(req.body)
        res.status(201).json({
            message:`User Created Successfully`
        })
    } catch (error) {
        
    }
}