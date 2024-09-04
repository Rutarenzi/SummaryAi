import { useCallback } from "react";
import toast from "react-hot-toast";


const callApi =()=>{

    const CHATGPT_API_KEY = "your_openai_api_key_here";

    const generateSummary= useCallback(async (note)=>{
        const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
        
        try{
            const data = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant that summarizes text." },
                    { role: "user", content: `Summarize the following text to 1/3 of its length:\n\n${note}` },
                ],
                max_tokens: Math.ceil(note.split(' ').length / 3), // This is just a heuristic
                temperature: 0.7,
            };

        const response = await fetch(CHATGPT_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATGPT_API_KEY}`,
            },
            body: JSON.stringify(data),
        });

        if(!response.ok) {
            console.error("API request failed:", response.statusText);
            toast.error("API request failed:", response.statusText)
            return null;
        }

        const respo = await response.json();
        return respo.choices[0].message.content.trim();
       
        }catch(error){
            console.error("Error occurred during API request:", error);
            toast.error("API request failed:", error)
            return null;

        }
    },[]);
    return {generateSummary}

}

export default callApi;