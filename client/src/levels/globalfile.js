import { createContext } from "react";
import { useState } from "react";
export const GlobalContext=createContext();

export default function GlobalProvider({children}){
     const[text,setText]=useState("");
     let mycode;
     const[listening,setlistening]=useState(false);
    const startListening=(code)=>{
        console.log(code);
//         if (
//   code === "bn-IN" ||
//   code === "bgc-IN" ||
//   code === "ta-IN" ||
//   code === "mr-IN" ||
//   code === "pa-IN" ||
//   code === "gu-IN" ||
//   code === "ml-IN" ||
//   code === "te-IN"
// ) {
//   mycode = "hi-IN";
// }
        
        // else{
        //     mycode=code;
        // }
        mycode=code;
        console.log(mycode);
        const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = mycode;
        recognition.interimResults = false;
        setlistening(true);
        recognition.start();  

        recognition.onresult = (e) => {
          const transcript = e.results[0][0].transcript;  
          setText(transcript);
          setlistening(false);
        };
        recognition.onerror=(e)=>{
            console.error(e);
            setlistening(false);
        };
        recognition.onend=(e)=>{
            setlistening(false)
        };

    }
    return (
        <GlobalContext.Provider value={{startListening,setlistening,setText,text}}>{children}
        </GlobalContext.Provider>
    )
}
