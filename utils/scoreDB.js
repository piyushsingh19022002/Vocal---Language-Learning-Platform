const express = require('express');
const router=express.Router();
const User=require('../models/User');

function getMonthActivity(user,year,month){
    const days=[];
    const start=new Date(year,month,1);
    const end=new Date(year,month+1,0);
    for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
        const dayObj=new Date(d);
        dayObj.setHours(0,0,0,0);
        const done= user.scoreHistory.some(entry=>{
            const e=new Date(entry.date);
            e.setHours(0,0,0,0);
            return e.getTime()===dayObj.getTime();
        })
        days.push({
            day:d.getDate(),
            done
        });

    }
    return days;
}

router.post("/score",async(req,res)=>{
    const {score,id}=req.body;
    //console.log(id);
    //console.log(score);
    const roundedScore=Math.round(score);
    const user=await User.findById(id);
    //console.log(user);
    if(!user){
        return res.status(404).json({message: "User not found"});

    }
    user.lastScore=roundedScore;
    if(roundedScore>user.bestScore){
        user.bestScore=roundedScore;
    }
    // Add to score history
    if(!user.scoreHistory){
        user.scoreHistory=[];
    }
    user.scoreHistory.push({
        score:roundedScore,
        date:new Date()
    });
    const today=new Date();
    console.log(today);
    today.setHours(0,0,0,0);
    const lastActive=user.lastActiveDate?new Date(user.lastActiveDate):null;
    if(lastActive) lastActive.setHours(0,0,0,0);

    if(lastActive && lastActive.getTime()===today.getTime()){
        console.log("Already Submitted today.");
    }
    else if(lastActive &&lastActive.getTime()===today.getTime()-86400000){
        user.currentStreak+=1;
    }
    else{
        user.currentStreak=1;
    }
    if(user.currentStreak>user.longestStreak){
        user.longestStreak=user.currentStreak;
    }
    user.lastActiveDate=today;
    await user.save();

    res.json({
        message:"Score saved",
        lastScore:user.lastScore,
        bestScore:user.bestScore
    });
})
router.get("/fetchdetail",async(req,res)=>{
    //console.log("hi mohituuuu");
    const id=req.query.id;
    const user=await User.findById(id);
    // const activity=[];
    const now=new Date();
    // for(let i=0;i<30;i++){
    //     const day=new Date(now);
    //     day.setDate(now.getDate()-i);
    //     day.setHours(0,0,0,0);

    //     const hasActivity=user.scoreHistory.some(entry=>{
    //         const d=new Date(entry.date);
    //         d.setHours(0,0,0,0);
    //         return d.getTime()===day.getTime();
    //     });
    //     activity.push({
    //         date:day,
    //         done:hasActivity
    //     });
    // }
    //console.log("its backend");
    //console.log(id);
    const currentMonth=getMonthActivity(user,now.getFullYear(),now.getMonth());
    const lastMonth=getMonthActivity(user,now.getFullYear(),now.getMonth()-1);
   
    
    //console.log(user);
    res.json({
        message:"fetch succesfully",
        lastScore:user.lastScore,
        bestScore:user.bestScore,
        currentStreak:user.currentStreak,
        longestStreak:user.longestStreak,
        currentMonth:currentMonth.reverse(),
        lastMonth:lastMonth.reverse()
    })
    
})
module.exports=router;