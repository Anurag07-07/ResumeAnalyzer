import { GoogleGenAI } from "@google/genai";
import { serverconfig } from "../config/server.config";
import { interviewReportSchemaZodd } from "../utils/ZodSchema";
import { tailoredResumeSchema } from "../utils/ZodSchema"
import { z } from "zod";

const ai = new GoogleGenAI({
     apiKey:serverconfig.GEMINI_KEY as string
})

//converting string(gemini response) into json format

function tryParseJSON(s:string):any| null {
    try{
        return JSON.parse(s);
    }catch{
        return null;
    }
}


export function sanitizeAI(data:any){
    const normalized = {...data};
    normalized.technicalQuestion = normalized.technicalQuestion ?? normalized.techicalQuestion;
    normalized.skillGap = normalized.skillGap ?? normalized.skillsGap;
    normalized.preparationPlan = normalized.preparationPlan ?? normalized.preparation ?? normalized.preparationPlanTasks;

    const normalizeQuestions = (questions:any, intentions:any, answers:any) => {
        if(!Array.isArray(questions)) return questions;
        return questions.map((item:any, index:number) => {
            const parsed = typeof item === "string" ? tryParseJSON(item) : null;
            const question = parsed && typeof parsed === "object"
                ? parsed
                : typeof item === "string" ? {question:item} : item;
            if(!question || typeof question !== "object" || Array.isArray(question)) return question;
            return {
                ...question,
                intention:question.intention ?? intentions?.[index],
                answer:question.answer ?? answers?.[index]
            };
        });
    };

    normalized.technicalQuestion = normalizeQuestions(
        normalized.technicalQuestion,
        normalized.technicalQuestionIntention,
        normalized.technicalQuestionAnswer
    );
    normalized.behaviouralQuestion = normalizeQuestions(
        normalized.behaviouralQuestion,
        normalized.behaviouralQuestionIntention,
        normalized.behaviouralQuestionAnswer
    );

    if(Array.isArray(normalized.skillGap)){
        const severities = normalized.skillGapSeverity ?? normalized.skillsGapSeverity;
        normalized.skillGap = normalized.skillGap.map((item:any, index:number) => {
            const parsed = typeof item === "string" ? tryParseJSON(item) : null;
            if(parsed && typeof parsed === "object") return parsed;
            if(typeof item === "string"){
                return {skill:item, severity:severities?.[index] ?? "medium"};
            }
            if(item && typeof item === "object"){
                return {...item, severity:item.severity ?? severities?.[index] ?? "medium"};
            }
            return item;
        });
    }

    if(Array.isArray(normalized.preparationPlan)){
        normalized.preparationPlan = normalized.preparationPlan.map((item:any, index:number) => {
            const parsed = typeof item === "string" ? tryParseJSON(item) : null;
            const plan = parsed && typeof parsed === "object"
                ? parsed
                : typeof item === "string" ? {tasks:item} : item;
            if(!plan || typeof plan !== "object" || Array.isArray(plan)) return plan;
            return {
                ...plan,
                day:plan.day ?? normalized.preparationPlanDay?.[index] ?? index + 1,
                focus:plan.focus ?? normalized.preparationPlanFocus?.[index] ?? "medium",
                tasks:plan.tasks ?? normalized.preparationPlanTasks?.[index]
            };
        });
    }
    return normalized;
}

export async function generateinterviewReport({
    resume,selfDescription,jobDescription
}:{resume:string, selfDescription:string, jobDescription:string}) {
    
    const prompt = 
    `You are an Elite Technical Hiring Manager and Career Coach.

Return STRICTLY VALID JSON only.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

OUTPUT FORMAT:
{
  "matchScore": number,
  "technicalQuestion": [
    { "question": string, "intention": string, "answer": string }
  ],
  "behaviouralQuestion": [
    { "question": string, "intention": string, "answer": string }
  ],
  "skillGap": [
    { "skill": string, "severity": "low" | "medium" | "high" }
  ],
  "preparationPlan": [
    { "day": number, "focus": "low" | "medium" | "high", "tasks": string }
  ]
}

Use exactly these property names and object shapes. Every array item must be an object with all listed properties. Do not return parallel arrays or flattened fields.`;

const response = await ai.models.generateContent({
    model:"gemini-3.8-flash",
    contents:prompt,
    config:{
        responseMimeType:"application/json",
        responseJsonSchema:z.toJSONSchema(interviewReportSchemaZodd),
    }
});

  const raw = (await response).text;

  console.log(raw);
  

  let parsed;

  try{
    parsed = JSON.parse(raw as  string);
  }catch(err){
    throw new Error("Ai returned invalid JSON");
  }

  if(!parsed || typeof parsed !== "object" || Array.isArray(parsed)){
    throw new Error("AI response must be a JSON object");
  }

  const sanitized = sanitizeAI(parsed);

  const validated = interviewReportSchemaZodd.safeParse(sanitized);

  if(!validated.success){
    console.log(validated.error.format());
    throw new Error("AI response failed schema validation")
  }
 return validated.data; 

}

export async function generateWithRetry(
  input: { resume: string; selfDescription: string; jobDescription: string },
  retries = 3
) {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await generateinterviewReport(input);
    } catch (err: any) {
      lastErr = err;
      // 429 quota exhaustion — retrying immediately won't help, fail fast
      if (err?.status === 429) {
        console.error("Quota exhausted (429) — not retrying.");
        break;
      }
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  throw lastErr ?? new Error("AI failed after retries");
}

export function sanitizeTailoredResume(data:any){
    if(Array.isArray(data.experience)){
        data.experience = data.experience.map((item:any)=>
            typeof item == "string" ? {company:"",role:item,duration:"",bullets:[]} : item
        )
    }
    if(Array.isArray(data.education)){
        data.education = data.education.map((item:any)=>
            typeof item == "string" ? {instituion:item,degree:"",year:""} : item
        )
    }
    if(Array.isArray(data.projects)){
        data.projects = data.projects.map((item:any)=>
            typeof item == "string" ? {name:item,description:"",tech:""} : item
        )
    }
    if(Array.isArray(data.skills)){
        data.skills = data.skills.flatMap((s:any)=>
            typeof s === "string" ? [s] : []
        )
    }
    if(Array.isArray(data.certifications)){
        data.certifications = data.certifications.flatMap((c:any)=>
            typeof c === "string" ? [c] : []
        )
    }
    return data
}

export async function generateTailoredResumeContent({
    resume,
    selfDescription,
    jobDescription 
}:{
    resume:string
    selfDescription:string
    jobDescription:string
}){
    const prompt = `You are an expert resume writer and career coach.

Based on the candidate's original resume, their self-description, and the target job description,
generate a fully tailored, ATS-optimized resume.

Original Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Return ONLY a raw JSON object (no markdown, no code fences) with EXACTLY this structure:
{
  "name": "<full name as string>",
  "title": "<target job title as string>",
  "email": "<email as string or empty string>",
  "phone": "<phone as string or empty string>",
  "location": "<city, country as string or empty string>",
  "linkedin": "<linkedin URL as string or empty string>",
  "summary": "<2-3 sentence ATS-optimized summary as string>",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. Jan 2022 - Present>",
      "bullets": ["<action verb bullet 1>", "<action verb bullet 2>"]
    }
  ],
  "education": [
    {
      "institution": "<university name>",
      "degree": "<degree and major>",
      "year": "<graduation year>"
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<1-2 sentence description>",
      "tech": "<comma-separated tech stack>"
    }
  ],
  "certifications": ["<cert1>", "<cert2>"]
}

CRITICAL RULES:
- experience, education, projects MUST be arrays of OBJECTS, never strings.
- bullets MUST be an array of strings.
- skills and certifications MUST be arrays of strings.
- If data is unavailable, use empty string "" or empty array [].
- Tailor summary, skills, and bullets to the target job description.`;
    const response = await ai.models.generateContent({
        model:"gemini-3.8-flash",contents:prompt,
        config:{
            responseMimeType:"application/json",
        }
    })
    
    const raw = response.text

    if(!raw) throw new Error("Ai returned empty reponse tailored resume")
    
    let parsed:any;
    try {
        parsed = JSON.parse(raw)
    } catch (error) {
        throw new Error(`AI retured invalid JSON for resume ${raw.slice(0,300)}`);
    } 

    const sanitized  = sanitizeTailoredResume(parsed)
    const validated = tailoredResumeSchema.safeParse(sanitized)
    if (!validated.success) {
        console.log(`Validation errors ${JSON.stringify(validated.error.format(),null,2)}`);
        throw new Error("Tailored resume failed schema validation")        
    }

    return validated.data
}



export async function generateTailoredResumeWithRetry(input:{resume:string,selfDescription:string,jobDescription:string},retries = 3){
    let lastErr:unknown;
    for(let i = 0;i < retries; i++){
       try {
         return await generateTailoredResumeContent(input)
       }catch(error:any){
          lastErr = error;

          if(error?.status==429){
            console.error("Quota exhausted")
            break;
          }

          console.log(`Resume retry ${i+1}/${retries}:`,error)
          await new Promise(res=>setTimeout(res,1500))
       }   
    }  
    throw lastErr ?? new Error("AI resume generation failed after retries")
}