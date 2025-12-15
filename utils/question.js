// import {GoogleGenAI} from "@google/genai";
// import readlineSync from "readline-sync";
const { GoogleGenAI } = require("@google/genai");
const express = require('express');
const router=express.Router();
const ai=new GoogleGenAI({apiKey:process.env.API_CHAT});

const ConversationHistory=[];

 async function main(msg){
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: msg }]
            }
        ]
    });
    return response.candidates[0].content.parts[0].text;
}

router.post('/fetchanswer',async(req,res)=>{
    try{
        //console.log("hi mohit");
        const{source,target,category,id}=req.body;
        //console.log(source);
        //console.log(target);
        //console.log(category);
        //console.log(id);
        const prompt=`
You are a language learning AI.

Task:
- Generate common sentences in the SOURCE language.
- Translate each sentence into the TARGET language.
- Generate the sentence only in this category ${category}.
- Provide pronunciation of the TARGET sentence **written using SOURCE language script**.
- Format strictly as valid JSON like:

{
  "sentence1_in_source": {
    "meaning_in_target": "",
    "pronunciation_in_source_script": ""
  },
  "sentence2_in_source": {
    "meaning_in_target": "",
    "pronunciation_in_source_script": ""
  }
}

SOURCE language: ${source}
TARGET language: ${target}

Pronunciation rule:
- Always write pronunciation of the TARGET sentence using SOURCE language letters.

Sentence count rules:
- If id = 1 → sentences must have at least 1 word.
- If id = 2 → sentences must have at least 3 words.
- If id = 3 → sentences must have at least 4 words.

Generate a total of 10 sentences.
The id value is: ${id}
Follow the rule based on this id.
`
        let response=await main(prompt);
        response =  response.replace(/^```json\s*|```$/g, '').trim();
        //console.log(typeof response);
        return res.json({result:response});

    }
    catch(err){
        console.error(err);
        return res.status(500).json({error:"server error while processing Ai request"});
    }
})
module.exports=router;







// let a;
// async function chatting(){
//     const question=readlineSync.question('How i help you mohit');
    
//     ConversationHistory.push({
//         role:"user",
//         parts:[{text:prompt}],
//     })
    
//         let response=await main(prompt);
//         console.log(response);
//         response =  response.replace(/^```json\s*|```$/g, '').trim();
//         console.log(response);

// }

// chatting();


