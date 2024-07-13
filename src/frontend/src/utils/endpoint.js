import { logout } from "./auth";
const endpoint = window.canister.summary;

export const welcome=async()=>{
 return endpoint.welcome();
}

export const createOrAdd=async(note)=>{
  return endpoint.createOrAdd(note)
}

export const updateNote=async(note,id)=>{
    return endpoint.updateNote(note,id)
}

export const getAll=async()=>{
    try{
       return endpoint.getAll()
    }catch(error){
        if (error.name === "AgentHTTPResponseError"){
          logout()
        }
    }
}
export const deleteAll=async()=>{
  return endpoint.deleteAll();
}

export const deleteSingle=async(noteId)=>{
   return endpoint.deleteSingle(noteId)
}

export const searchNotes=async(note)=>{
  return endpoint.searchNotes(note)
}