import React,{ useContext,useState } from "react";
import { MyContext } from "../Context/myContext";
import { login, logout } from "../utils/auth";
import { searchNotes,deleteAll } from "../utils/endpoint";
import toast from "react-hot-toast";


const TopBar=()=>{
  const [query,setQuerry] = useState(" ");
  const { setError,setSummaries,loggedIn } = useContext(MyContext);

   const submitQuery =async(e)=>{
    e.preventDefault();
    const searchWord =query
   try{
    if(searchWord.length > 3){
      const response = await searchNotes(searchWord)
      if(response.Ok){
        setSummaries(response.Ok)
        setError(" ")
      } 
      if(response.Err){
        toast.error(`${response.Err.NotFound}`);
      }
    }
  
   }catch(err){
    console.log(err)
     setError(err)
   }

   }
    return(
    
        <div className="topbar">
          <div className="topbarContainer">
             <div className="logo">
               <img src="src/frontend/src/assets/summaryAI.png" alt="logo image" className="logo-IMG"/>
             </div>
            {loggedIn &&<><div className="InputSearch">
              <div className="SearchContainer">
                <input 
                  type="text"
                  name="query"
                  value={query}
                  onChange={(e)=>setQuerry(e.target.value)}
                  className="InputKey"
                  placeholder="Search for a note and summary"
                />
                <button onClick={submitQuery} 
                disabled={query.length < 3? true:false}
                className="BtnSaver">
                  Search
                </button>
             </div></div>
             <div className="btn-logout">
                <button className="BtnSave" onClick={deleteAll}>
                  Delete All
                </button>
                <button className="BtnSave" onClick={login}>
                  Login 
                </button>
                <button className="BtnSave" onClick={logout}>
                  Logout
                </button>
             </div>
             </>
             }  
          </div>
        </div>
    )
}

export default TopBar;