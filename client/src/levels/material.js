import {GoogleGenAI} from '@google/genai';
import { text } from 'express';

const ai=new GoogleGenAI({apiKey:""});
const ConversationHistory=[];

export async function main(msg){
    const response=await ai.models.generateContent({
        model:"gemini-2.5-flash",
        content:msg
    });
    return response.text;
}

