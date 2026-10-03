import { Router } from "express";
import { signinController, signupController } from "../controllers/auth.controller";
import { schemavalidator } from "../validators";
import { createuser, loginuser } from "../validators/user.validator";

const authRouter = Router();

authRouter.post("/signup", schemavalidator(createuser as any), signupController);

authRouter.post("/signin", schemavalidator(loginuser as any), signinController);

export default authRouter;