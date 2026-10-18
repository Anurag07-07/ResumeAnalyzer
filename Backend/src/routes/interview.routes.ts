import { Router } from "express";
import upload from "../middlewares/file.middleware";
import { generateTailoredResumeController, getReportsByIdController, getReportsController, InterviewController } from "../controllers/interview.controller";
import { authUser } from "../middlewares/auth.middleware";

const interviewRouter:Router=Router();

interviewRouter.post('/interview',authUser,upload.single("resume"),InterviewController);

interviewRouter.get('/reports',authUser,getReportsController);

interviewRouter.get('/reports/:id',authUser,getReportsByIdController);

interviewRouter.post('/reports/:id/tailored-resume',authUser,generateTailoredResumeController);

export default interviewRouter;