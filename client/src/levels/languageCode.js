import { useEffect } from "react";

export default function Languagecode({ language, onCodeChange }){
    const Language=language;
    let languageCode;
    console.log(Language);
    if(language==="Hindi"||"Bhojpuri"){
        languageCode="hi-IN";
    }
    if(language==="Bengali"){
        languageCode="bn-IN";
    }
    if(language==="Haryanvi"){
        languageCode="bgc-IN";
    }
    if(language==="Tamil"){
        languageCode="ta-IN";
    }
    if(language==="Marathi"){
        languageCode="mr-IN";
    }
    if(language==="Punjabi"){
        languageCode="pa-IN";
    }

    if(language==="English"){
        languageCode="en-US";
    }
    if(language==="French"){
        languageCode="fr-FR";
    }
    if(language==="Chinese"){
        languageCode="zh-CN";
    }
    if(language==="Arabic"){
        languageCode="ar-SA";
    }
    if(language==="Russian"){
        languageCode="ru-RU";
    }
    if(language==="Italian"){
        languageCode="it-IT";
    }
    if(language==="Korean"){
        languageCode="ko-KR";
    }
    if(language==="German"){
        languageCode="de-DE";
    }
    if(language==="Japanese"){
        languageCode="ja-JP";
    }
    console.log(languageCode);
    useEffect(()=>{
        if(languageCode){
            onCodeChange(languageCode);
        }
    },[language])
}