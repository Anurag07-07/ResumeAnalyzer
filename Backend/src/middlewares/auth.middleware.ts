import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverconfig } from "../config/server.config";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string;
        }
    }
}

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    try {
        const decoded = jwt.verify(token, serverconfig.JWT_SECRET) as JwtPayload | string;
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
