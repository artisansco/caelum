import {  form, getRequestEvent, query } from "$app/server";
import { API_ENDPOINT } from "$env/static/private";
import {z} from "zod"

const subject_schema = z.object({
  name:z.string().trim().min(2,{error:"subject name is too small, 2 or more characters"}),
  code:z.string().trim().min(4).optional(),
})

export const get_all_subjects = query(async()=>{
 const {cookies} = getRequestEvent()
try{
 const res = await fetch(`${API_ENDPOINT}/api/v1/subjects`)
 const {message,data}=await res.json()
 if(!res.ok){
   return {message}
 }

 return data.subjects

} catch(_e){
 //@ts-ignore
 return {message:_e.message}
}


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

  await get_all_subjects().refresh()

} catch(_e){
  //@ts-ignore
  return {message:_e.message}
}


})


 export const delete_subject = form(async(form_data)=>{
   const subject_id = form_data.get("subject_id") as string

   const {cookies}=getRequestEvent()
try{
  const res = await fetch(`${API_ENDPOINT}/api/v1/subjects/${subject_id}`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${cookies.get("token")}`
    },
  })
  const {message}=await res.json()
  if(!res.ok){
    return {message}
  }

  await get_all_subjects().refresh()

} catch(_e){
  //@ts-ignore
  return {message:_e.message}
}
})
