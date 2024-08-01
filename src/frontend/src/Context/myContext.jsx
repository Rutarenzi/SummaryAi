import React,{ useCallback, useState,createContext } from "react";
import { getAll } from "../utils/endpoint";

const MyContext = createContext();


 const MyProvider=({children})=>{

    const [summaries,setSummaries] = useState();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(" ");


    const getSummary = useCallback(async()=>{
       try{
         setLoading(true)
         const response= await getAll();
         if(response.Ok){
           setSummaries(response.Ok)
           setLoading(false);
           setError(" ")
         }
         if(response.Err){
          setLoading(false);
         }
         return;
       }catch(error){
        setLoading(false)
        setError(error);
        return;
       }
    },[])


    const loggedIn = window.auth.isAuthenticated;
    const dataValues = {
      loading,
      error,
      setError,
      getSummary,
      summaries,
      loggedIn,
      setSummaries
    }
   return(
    <MyContext.Provider value={dataValues}>
       {children}
    </MyContext.Provider>
   )

}

export {MyContext,MyProvider}