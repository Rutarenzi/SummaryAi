import React,{useContext} from "react";
import TopBar from "./component/TopBar";
import Home from "./component/Home";
import Summary from "./component/Summary";
import { MyContext } from "./Context/myContext";


const App=()=>{
    const { loggedIn } =useContext(MyContext)
    return(
        <>
         <TopBar/>
         {loggedIn?<Summary/> : <Home/>} 
        </>
        
    )
}

export default App;