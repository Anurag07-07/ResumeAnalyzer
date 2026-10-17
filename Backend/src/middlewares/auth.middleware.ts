import { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { serverconfig } from "../config/server.config";
import { isTokenBlacklisted } from "../repositories/cache.repository";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.token?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    const isBlacklisted = await isTokenBlacklisted(token);

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Token is no longer valid (Logged out)"
        })
    }

    try {

        const decoded = jwt.verify(token, serverconfig.JWT_SECRET) as JwtPayload;
        req.user = decoded

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
