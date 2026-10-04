import { NextFunction, Request, Response } from "express";
import jwt , {type JwtPayload} from "jsonwebtoken";
import { serverconfig } from "../config/server.config";


export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }

        const decoded = jwt.verify(token, serverconfig.JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.id!

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
