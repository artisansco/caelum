import { form, getRequestEvent } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import {z} from "zod"

const subject_schema = z.object({
  name:z.string().trim().min(2,{error:"subject name is too small, 2 or more characters"}),
  code:z.string().trim().min(4),
})


 export const add_subject = form(async(form_data)=>{
  const form = Object.fromEntries(form_data)
  const {success,data,error} = subject_schema.safeParse(form)

  console.log({data})
  if(!success){
    const message = error.issues.at(0)?.message as string
    return {message}
  }

  const {cookies} = getRequestEvent()
try{
  const res = await fetch(`${API_ENDPOINT}/api/v1/subjects`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${cookies.get("token")}`
    },
    body:JSON.stringify(data)
  })
  const {message}=await res.json()
  if(!res.ok){
    return {message}
  }

} catch(_e){
  //@ts-ignore
  return {message:_e.message}
}


})
