import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod/v3";


export function schemavalidator(schema: AnyZodObject){
     return async (req:Request, res: Response, next: NextFunction)=>{
             try {
              await schema.parseAsync(req.body)
              next()
             }catch(error){
                res.status(401).json({
                    message:"Invalid body",
                    success:false,
                    error:error
                })
             }
     }
}