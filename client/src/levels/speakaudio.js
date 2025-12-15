export default function SpeakSentence({sentence,lang}){
    let code;
    console.log(lang);
    if (lang === "bgc-IN" || lang === "bn-IN" || lang === "mr-IN") {
    code = "hi-IN";
} else {
    code = lang;
}
    
    console.log(lang);
    console.log(code);
    const speak=()=>{
        const speech =new SpeechSynthesisUtterance(sentence);
        speech.lang=code;
        speech.rate=1;
        speech.pitch=1;
        window.speechSynthesis.speak(speech);

    };
    return (
        <button onClick={speak}>
            🔊 Speak
        </button>
    )
}




