import { Request, Response } from "express";
import * as pdfParse from "pdf-parse";
import { generateTailoredResumeService, getReportsbyIdService, getReportsService, InterviewReportService } from "../services/interview.service";

export async function InterviewController(req:Request,res:Response){
    try{
        const {selfDescription,jobDescription}=req.body;
        if(!req.file)return res.status(400).json({
            message:"No file uploaded"
        });

        const pdfData=await new pdfParse.PDFParse(Uint8Array.from(req.file.buffer));
        const resumeText=pdfData.getText();
        const text=(await resumeText).text;
        const userId=req.user.userId;

        const interviewReport = await InterviewReportService({text,userId,selfDescription,jobDescription});
        console.log(interviewReport);
        
        
        return res.status(201).json({
            success:true,
            data:interviewReport
        });
    }catch(error:any){
        console.error(error);
        return res.status(500).json({
            message:error.message
        })
    }
}

export async function getReportsController(req:Request,res:Response) {
    try{
        const userId=req.user.userId;
        const reports=await getReportsService(userId);
        
        return res.status(200).json({
            success:true,
            data:reports
        });
    }catch(error:any){
        console.error(error);
        return res.status(500).json({
            message:error.message
        });
    }
}

export async function getReportsByIdController(req:Request,res:Response) {
    try{
        const userId=req.user.userId;
        const id=req.params.id as string;
        const report=await getReportsbyIdService({userId,id});

        if(!report) {
            return res.status(404).json({
                message:"Report not found"
            });
        }

        return res.status(200).json({
            success:true,
            data:report
        });


    }catch(error:any){
        console.error(error);
        return res.status(500).json({
            message:error.message
        });
    }
}

export async function generateTailoredResumeController(req:Request,res:Response){
    try{
        const userId=req.user.userId;
        const id=req.params.id as string;
        const report=await getReportsbyIdService({userId,id});

        if(!report) return res.status(404).json({
            message:"Report not found"
        });

        if(!report.resume) return res.status(400).json({
            message:"No resume text in this report"
        });

        const tailored= await generateTailoredResumeService(report);

        return res.status(200).json({
            success:true,
            data:tailored
        });
    }catch(error:any){
        console.error("Tailored resume error:",error);
        return res.status(500).json({
            message:error.message
        });
    }
}