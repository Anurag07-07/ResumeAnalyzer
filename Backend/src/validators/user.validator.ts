import z from "zod";

export const createuser=z.object({
    username:z.string().min(4),
    email:z.email(),
    password:z.string().min(8)
})

export const loginuser=z.object({
    username:z.string().min(4).optional(),
    email:z.email(),
    password:z.string().min(8)
})