import { NextFunction, Request, Response } from "express";
import { logoutservice, signinservice, signupservice } from "../services/auth.service";


export async function signupController(req: Request, res: Response) {
    try {
        const response = await signupservice(req.body)
        res.cookie("token", response.token, { httpOnly: true, secure: true, sameSite: "none" })

        return res.status(201).json({
            message: "User registered successfully",
            user: response.user
        })
    } catch (error) {
        return res.status(400).json({
            message: "User already exists",
        })
    }
}

export async function signinController(req: Request, res: Response) {
    try {
        const response = await signinservice(req.body);
        res.cookie("token", response.token, { httpOnly: true, secure: true, sameSite: "none" })

        return res.status(200).json({
            message: "User signin successfully",
            user: response.user
        })
    } catch (error) {
        return res.status(400).json({
            message: "Invalid username or password",
        })
    }
}

export async function logout(req: Request, res : Response){
   const user =  await logoutservice(req.userId)  
}