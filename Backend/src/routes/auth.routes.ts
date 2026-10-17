import { Router } from "express";
import { logoutController, signinController, signupController } from "../controllers/auth.controller";
import { schemavalidator } from "../validators";
import { createuser, loginuser } from "../validators/user.validator";
import { authUser } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", schemavalidator(createuser as any), signupController);

authRouter.post("/signin", schemavalidator(loginuser as any), signinController);

authRouter.get("/logout",authUser,logoutController)

export default authRouter;