import {
    query,
    update,
    text,
    Record,
    StableBTreeMap,
    Variant,
    Vec,
    Ok,
    Err,
    ic,
    Principal,
    Opt,
    nat64,
    // Duration,
    Result,
    bool,
    Canister,
    init,
    Void,
    nat,
  } from "azle/experimental";
import { v4 as uuidv4 } from "uuid";

const NoteSummary = Record({
    id: text,
    note: text,
    summary: text
})


const Summary = Record({
    id: text,
    summaries: Vec(NoteSummary)

});

type NoteSummary = typeof NoteSummary.tsType
type Summary = typeof Summary.tsType

const messages = Variant({
    NotFound: text,
    Error: text,
    Unsupported: text
})

type messages = typeof messages.tsType

const UserSummary = StableBTreeMap<Principal,Summary>(0)


export default Canister({
    welcome: query([],text,()=>{
        return "Hello, welcome to summarize!! Give us the note we can summarize"
    }),
     
 
    createOrAdd: update([text,text], Result(Summary,messages), async(note,summary)=>{
       try{
        if(!note || note.length < 10 || !summary){
            return Err({Unsupported:"Please note can not be empty or less 10 and summary cannot empty"})
        }

        const UserSummaryOpt = UserSummary.get(ic.caller());

        const noteSummary: NoteSummary = {
          id:  uuidv4(),
          note,
         summary,
        }
        if(!UserSummaryOpt){
        const summaryRecord = {
          id: uuidv4(),
          summaries: [noteSummary]
        }  
         
        UserSummary.insert(ic.caller(), summaryRecord)
        
        }
        
        if(UserSummaryOpt){
            const existNoteSummary = UserSummaryOpt.summaries || []
            const newNoteSummary = [...existNoteSummary,{...noteSummary}];

            const updateSummary = {
                id: UserSummaryOpt?.id,
                summaries: newNoteSummary
            }

            UserSummary.insert(ic.caller(),updateSummary)
        }
        const UserSummaryOp= await UserSummary.get(ic.caller());
        return Ok(UserSummaryOp)
       }catch(error){
        return Err({Error: `Error Occured ${error}`})  
       }
     }),

    updateNote: update([text,text,text], Result(Vec(NoteSummary),messages), async (note,summary,id)=>{
        try{
            if(!note || note.length< 10  || !id || !summary){
                return Err({Unsupported:"Error occured!! note is less 10 or empty id or summary cannot be empty"})
            }

            const userSummaryOpt = UserSummary.get(ic.caller());
            
            if(!userSummaryOpt){
                return Err({NotFound:"You do not have any summary yet"})
            }
            
             if(userSummaryOpt){
                if(!userSummaryOpt.summaries.map((item:NoteSummary)=> item.id).includes(id)){
                    return Err({NotFound:"this Notesummary does not exist or belong to you"})
                } else {

                    const index = userSummaryOpt.summaries.findIndex((item)=>{return item.id === id});
                    const existNoteSummary = userSummaryOpt.summaries
                    if(index !== -1){
                        existNoteSummary[index].note = note;
                        existNoteSummary[index].summary=summary;
                        const updateSummary = {
                            id:userSummaryOpt?.id ,
                            summaries: existNoteSummary
                        }
                        UserSummary.insert(ic.caller(),updateSummary) 
                    }                         
                }
            }
            const UserSummaryOp = await UserSummary.get(ic.caller());
            console.log(UserSummaryOp?.summaries)
            return Ok(UserSummaryOp?.summaries)
              

        }catch(error){
            return Err({Error: `Error Occured ${error}`})
        }
    }),

    getAll: query([],Result(Vec(NoteSummary),messages),()=>{
        try{
            const userSummaryOpt = UserSummary.get(ic.caller());
          
            if(!userSummaryOpt){
                return Err({NotFound:"You do not have any summary yet"})
            }
           
            return Ok(userSummaryOpt.summaries)
        }catch(error){
            return Err({Error: `Error Occured ${error}`})  
        }
    }),

    deleteAll: update([],Result(text,messages),()=>{
        try{
            const userSummaryOpt = UserSummary.get(ic.caller());
            if(!userSummaryOpt){
                return Err({NotFound:"You do not have any summary yet"})
            }
            UserSummary.remove(ic.caller())
            const userSummaryOpt2 = UserSummary.get(ic.caller());
            console.log(userSummaryOpt2)
            return Ok("delete successfully")

        }catch(error){
            return Err({Error: `Error Occured ${error}`})  
        }

    }),

  deleteSingle: update([text],Result(text,messages), (id)=>{
  
 try{
    
        if(!id){
            return Err({Unsupported:"Please provide the id"})
        }

        const userSummaryOpt = UserSummary.get(ic.caller());
      
        if(!userSummaryOpt){
            return Err({NotFound:"You do not have any summary yet"})
        }
        
       if(userSummaryOpt){
        if(!userSummaryOpt.summaries.map((item:NoteSummary)=>{ return item.id}).includes(id)){
            return Err({NotFound:"this Notesummary does not exist or belong to you"})
        } else {
            const existNoteSummary = userSummaryOpt.summaries
            const updateNoteSummary = existNoteSummary.filter((data:NoteSummary)=>{
                return data.id !== id
            })
            const updateSummary = {
                id:userSummaryOpt.id,
                summaries: updateNoteSummary
            }
            UserSummary.insert(ic.caller(),updateSummary)            
        }
       }
        return Ok("deleted successful")       
     }catch(error){
        return Err({Error: `Error Occured ${error}`}) 
     }
   }),

   searchNotes: query([text], Result(Vec(NoteSummary),messages),(note)=>{
    try{
        const userSummaryOpt = UserSummary.get(ic.caller());
        if(!userSummaryOpt){
            return Err({NotFound:"You do not have any summary yet"})
        }
        const lowerNote = note.toLowerCase();
        const noteSum =userSummaryOpt.summaries
        const searchResult = noteSum.filter((notesummary:NoteSummary)=>{
            return notesummary.note.toLowerCase().includes(lowerNote) ||
            notesummary.summary.toLowerCase().includes(lowerNote)
        })
          return Ok(searchResult)
    }catch(error){
        return Err({Error: `Error Occured ${error}`})  
    }
   }),
   
 
});


