import { Request, Response } from "express";
import { logoutservice, signinservice, signupservice } from "../services/auth.service";

export async function signupController(req: Request, res: Response) {
    try {
        const response = await signupservice(req.body)
        res.cookie("token", `Bearer ${response.token}`, { httpOnly: true, secure: true, sameSite: "none" })

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
        res.cookie("token", `Bearer ${response.token}`, { httpOnly: true, secure: true, sameSite: "none" })

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

export async function logoutController(req: Request, res: Response) {

    const token = req.cookies.token?.split(' ')[1];

    const exp=req.user.exp;

    await logoutservice(token,exp);

    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(200).json({
        message: "User logged out successfully",
    });
}