import interviewSchema from "../models/interview.Schema";

export interface IInterviewReport{
    text:string;
    userId:string;
    selfDescription:string;
    jobDescription:string;
}

export interface IReport{
    userId:string;
    id:string;
}

export async function InterviewReportService(data:IInterviewReport){
    const {text,userId,selfDescription,jobDescription}=data;

    const interviewReportByAi = await generateWithRetry({
      resume: text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewSchema.create({
      user: userId,
      resume: text,
      selfDescription,
      jobDescription,
      matchScore: interviewReportByAi.matchScore,
      technicalQuestion: interviewReportByAi.technicalQuestion,
      behaviouralQuestion: interviewReportByAi.behaviouralQuestion,
      skillGap: interviewReportByAi.skillGap,
      preparationPlan: interviewReportByAi.preparationPlan,
    });

    return interviewReport;
}

export async function getReportsService(userId:string) {
    const reports=await interviewSchema
    .find({user:userId})
    .select("jobDescription matchScore createdAt selfDescription")
    .sort({createdAt:-1})
    .lean();

    return reports;
}

export async function getReportsbyIdService(data:IReport) {
    const {userId,id}=data;
    const report=await interviewSchema.findOne({
        _id:id,
        user:userId
    }).lean();

    return report;
}

export async function generateTailoredResumeService(report:any){
    const tailored=await generateTailoredResumeWithRetry({
        resume:report.resume,
        selfDescription:report.selfDescription ?? "",
        jobDescription:report.jobDescription
    });

    return tailored;
}