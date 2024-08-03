import React,{ useState,useContext,useEffect } from "react";
import { MyContext } from "../Context/myContext";
import { createOrAdd,updateNote,deleteSingle } from "../utils/endpoint";
import {AiOutlineEdit,AiOutlineDelete } from "react-icons/ai"
import toast from "react-hot-toast";

const Summary=()=>{
    const [input, setInput] = useState("");
    const [editor,setEditor]= useState(false);
    const [id,setId] = useState("")
    const { summaries,error,loading,getSummary } = useContext(MyContext);
  
    useEffect(async()=>{
      const allSummary = async()=>{
       await getSummary()
      } 
      await allSummary()
    },[]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const note = input;
        if(note.length >10) {
          await createOrAdd(note)
          await getSummary()
          setInput(" ")
        }
      };
  const editNote=async(note)=>{
          setInput(note.note);
          setId(note.id)
          setEditor(true)
  }

  const editSubmit=async(e)=>{
    e.preventDefault();
    const note = input;
   if(note && id){
    const response = await updateNote(input,id);
    setInput(" ");
    setId(" ");
    setEditor(false)
    if(response.Err){
      toast.error(`${response.Err.NotFound ||response.Err.Error || response.Err.Unsupported}`);
    }
    await getSummary()
   }
  }
  const deleteNote=async(id)=>{
     const response =await deleteSingle(id)
     if(response.Err){
      toast.error(`${response.Err.NotFound || response.Err.Unsupported}`);
    }
     await getSummary()
  }
 
    return(
        <div className="chat-container">
        <div className="chat-box">
          
          {summaries?.map((msg, index) => (
            <>

            <div key={index} className={`chat-message user`}>
              <div>
              {msg.note}
              <div className="actionBtn">
                <button className="editBtn" onClick={()=>{editNote(msg.note)}}>
                <AiOutlineEdit/>
                </button>
                <button className="deleteBtn" onClick={()=>{deleteNote(msg.id)}}>
                  <AiOutlineDelete/>
                </button>
              </div>
              </div>
             <div classname="chat-message ai">
                    {msg.summary}
                </div>
            </div>
            <div  key={index} className={`chat-message ai`}>
                    <div>{msg.summary}</div>
                </div>
            </>
          ))}

        </div>
        <form onSubmit={editor?editSubmit:handleSubmit} className="chat-input-box">
          <textarea
            type="text"
            name="note"
            value={input}
            onChange={(e) => {setInput(e.target.value)}}
            placeholder="Type your message..."
            className="chat-input"
            row="1"
          />
          <button type="submit" className="chat-submit"  disabled={(input.length <10)? true:false}>{loading? "...":"+"}</button>
        </form>
      </div>
    )
}

export default Summary


