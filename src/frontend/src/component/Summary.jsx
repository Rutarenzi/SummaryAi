import React,{ useState,useContext,useEffect } from "react";
import { MyContext } from "../Context/myContext";
import { createOrAdd,updateNote,deleteSingle } from "../utils/endpoint";
import {AiOutlineEdit,AiOutlineDelete } from "react-icons/ai"
const Summary=()=>{
    const [input, setInput] = useState();
    const [editor,setEditor]= useState(false);
    const [id,setId] = useState()
    const { summaries,error,loading,getSummary } = useContext(MyContext);
    
    useEffect(async()=>{
      const allSummary = async()=>{
       await getSummary()
      } 
      await allSummary()
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault();
        const note = e.target.value.note;
        if(note.length >10) {
          await createOrAdd(note)
          await getSummary()
        }
      };
  const editNote=async(note)=>{
          setInput(note.note);
          setId(note.id)
          setEditor(true)
  }
  const editSubmit=async()=>{
   if(note && id){
    await updateNote(input,id);
    setInput(" ");
    setId(" ");
    setEditor(false)
    await getSummary()
   }
  }
  const deleteNote=async(id)=>{
     await deleteSingle(id)
     await getSummary()
  }
    return(
        <div className="chat-container">
        <div className="chat-box">
          
          {summaries?.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.isUser ? 'user' : 'ai'}`}>
              <div>
              {msg.text}
              <div className="actionBtn">
                <button className="editBtn" onClick={()=>{editNote(msg)}}>
                <AiOutlineEdit/>
                </button>
                <button className="deleteBtn" onClick={()=>{deleteNote(msg.id)}}>
                  <AiOutlineDelete/>
                </button>
              </div>
              </div>
            </div>
          ))}

        </div>
        <form onSubmit={editor?editSubmit:handleSubmit} className="chat-input-box">
          <textarea
            type="text"
            name="note"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            row="1"
          />
          <button type="submit" className="chat-submit" disabled={input.length <10? true:false}>&uarr;</button>
        </form>
      </div>
    )
}

export default Summary


