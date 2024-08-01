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
    note: text,
    summary: text,
    id: text
})


const Summary = Record({
    id: text,
    summaries: Vec(NoteSummary)

})
type NoteSummary = typeof NoteSummary.tsType
type Summary = typeof Summary.tsType

const messages = Variant({
    NotFound: text,
    Error: text,
    Unsupported: text
})

type messages = typeof messages.tsType

const UserSummary = StableBTreeMap<Principal,Summary>(0)

const CHATGPT_API_KEY = "your_openai_api_key_here";
const CHATGPT_API_URL = "https://api.openai.com/v1/engines/davinci-codex/completions";



export default Canister({
    welcome: query([],text,()=>{
        return "Hello, welcome to summarize!! Give us the note we can summarize"
    }),
     
    
    createOrAdd: update([text], Result(Summary,messages),async(note)=>{
       try{
        if(!note || note.length< 10){
            return Err({Unsupported:"Please note can not be empty or less 10"})
        }
        const UserSummaryOpt = UserSummary.get(ic.caller());
        const summary = await generateSummary(note);
        if(!summary){
            return Err({Error:"Try again! we can not summarize your not now"})
        }
        const noteSummary: NoteSummary = {
         id: uuidv4(),
         note,
         summary,
        }
        if(!UserSummaryOpt){
          const summaryRecord = {
            id: uuidv4(),
            summaries: [{...noteSummary}]
          }  
          UserSummary.insert(ic.caller(), summaryRecord)
        }else {
            const existNoteSummary = UserSummaryOpt.summaries
            const newNoteSummary = [...existNoteSummary,{...noteSummary}];
            const updateSummary = {
                id:UserSummaryOpt.id,
                summaries: newNoteSummary
            }
            UserSummary.insert(ic.caller(),updateSummary)
        }
         
        return Ok(UserSummaryOpt as Summary)
       }catch(error){
        return Err({Error: `Error Occured ${error}`})
       }
     }),

    updateNote: query([text,text], Result(Vec(NoteSummary),messages), async (note, id)=>{
        try{
            if(!note || note.length< 10  || !id){
                return Err({Unsupported:"Error occured!! note is less 10 or empty id"})
            }
            const userSummaryOpt = UserSummary.get(ic.caller());
            if(!userSummaryOpt){
                return Err({NotFound:"You do not have any summary yet"})
            }else if(!userSummaryOpt.summaries.map(item=> item.id).includes(id)){
                return Err({NotFound:"this Notesummary does not exist or belong to you"})
            } else {
                const summary = await generateSummary(note);
                if(!summary){
                    return Err({Error:"Try again we can summarize your note for  now"})
                }
                const noteSummary: NoteSummary = {
                 id,
                 note,
                 summary,
                }
                const existNoteSummary = userSummaryOpt.summaries
                const updateNoteSummary = [...existNoteSummary,{...noteSummary}];
                const updateSummary = {
                    id:userSummaryOpt.id,
                    summaries: updateNoteSummary
                }
                UserSummary.insert(ic.caller(),updateSummary)        
            }
            return Ok(userSummaryOpt.summaries)

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
    deleteAll: query([],Result(text,messages),()=>{
        try{
            const userSummaryOpt = UserSummary.get(ic.caller());
            if(!userSummaryOpt){
                return Err({NotFound:"You do not have any summary yet"})
            }
            UserSummary.remove(ic.caller())
            return Ok("delete successfully")

        }catch(error){
            return Err({Error: `Error Occured ${error}`})  
        }

    }),
   deleteSingle: query([text],Result(text,messages), (id)=>{
     try{
        if(!id){
            return Err({Unsupported:"Please provide the id"})
        }
        const userSummaryOpt = UserSummary.get(ic.caller());
        if(!userSummaryOpt){
            return Err({NotFound:"You do not have any summary yet"})
        }else if(!userSummaryOpt.summaries.map(item=> item.id).includes(id)){
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
        return Ok("delete successfully")       
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
        const searchResult = noteSum.filter((notesummary)=>{
            return notesummary.note.toLowerCase().includes(lowerNote) ||
            notesummary.summary.toLowerCase().includes(lowerNote)
        })
          return Ok(searchResult)
    }catch(error){
        return Err({Error: `Error Occured ${error}`})  
    }
   }),
   
 
});


async function generateSummary(text: string): Promise<string | null> {
    const data = {
        prompt: `Summarize the following text to 1/3 of its length:\n\n${text}`,
        max_tokens: Math.ceil(text.split(' ').length / 3),
        n: 1,
        stop: null,
        temperature: 0.7,
    };

    try {
        const response = await fetch(CHATGPT_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPT_API_KEY}`,
            },
            body: JSON.stringify(data),
        });

        if(!response.ok) {
            return null;
        }

        const respo = await response.json();
        return respo.choices[0].text.trim();
    } catch (error) {
        return null;
    }
}
