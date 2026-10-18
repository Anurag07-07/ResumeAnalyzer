import {z} from "zod";

const severityEnum = z.enum(["low","medium","high"]);

export const interviewReportSchemaZodd = z.object({
    matchScore:z.number().min(0).max(100).describe("A score that describes how well the resume fits the JD"),

    technicalQuestion:z.array(
        z.object({
            question:z.string().describe("Specific technical question based on the tech stack"),
            intention:z.string().describe("What the interviewer is trying to evalute with the question"),
            answer:z.string().describe("The ideal model answer for the candidate")
        })
    ),
    behaviouralQuestion:z.array(
        z.object({
            question:z.string().describe("Situational or personality-based question"),
            intention:z.string().describe("The soft skill or trait being tested"),
            answer:z.string().describe("A high-quality STAR method response")
        })
    ),
    skillGap:z.array(
        z.object({
            skill:z.string().describe("The specific tool or concept missing from the resume"),
            severity:severityEnum.describe("How critical this skill is for the role")
        })
    ),
    preparationPlan:z.array(
        z.object({
            day:z.number().describe("Day number of the study plan"),
            focus:severityEnum.describe("The intensity or importance of this day's task"),
            tasks:z.string().describe("Detailed actionable study steps")
        })
    )
});

export type IInterviewReport = z.infer<typeof interviewReportSchemaZodd>;

export const tailoredResumeSchema = z.object({
    name:z.string().default(""),
    title:z.string().default(""),
    email:z.string().nullable().optional().transform(v => v ?? ""),
    phone:z.string().nullable().optional().transform(v => v ?? ""),
    location:z.string().nullable().optional().transform(v => v ?? ""),
    linkedlin:z.string().nullable().optional().transform(v => v ?? ""),
    summary: z.string().default(""),
    skills:z.array(z.string()).default([]),
    experience:z.array(
        z.object({
            company:z.string().default(""),
            role:z.string().default(""),
            duration:z.string().nullable().optional().transform(v => v ?? ""),
            bullets:z.array(z.string()).default([]),
        })
    ).default([]),
    education:z.array(
        z.object({
            institution:z.string().default(""),
            degree:z.string().default(""),
            bullets:z.string().nullable().optional().transform(v => v ?? ""),
        })
    ),
    projects:z.array(
        z.object({
            name:z.string().default(""),
            description:z.string().default(""),
            tech:z.string().nullable().optional().transform(v => v ?? "")
        })
    ).default([]),

    certifications:z.array(z.string()).default([])

});
export type ITailoredResume = z.infer<typeof tailoredResumeSchema>;