import { tailoredResumeSchema } from "../utils/ZodSchema"

function sanitizeTailoredResume(data:any){
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

async function generateTailoredResumeContent({
    resume,
    selfDescription,
    jobDescription 
}:{
    resume:string
    selfDescription:string
    jobDescription:string
}){
    const prompt = ``
    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",contents:prompt,
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