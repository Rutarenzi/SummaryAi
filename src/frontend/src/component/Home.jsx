import { login } from "../utils/auth";


const Home=()=>{
  return(
    <div className="HomeContainer">
        <div className="Welcome">
            <h1>SummaryAi</h1>
            <p>Transform Your Note-Taking,<br/> Experience the 
                Power of AI Summarization for Effortless Insights!</p>
            <button className="loginBtn" onClick={login}>Login</button>
        </div>
    </div>
  )
}

export default Home;