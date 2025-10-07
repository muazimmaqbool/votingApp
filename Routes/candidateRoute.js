const express=require('express');
const router=express.Router();//used to manage routes
const {jwtAuthMiddleware,generateToken}=require("../jwt")
const Candidate=require("../Models/candidate")

//post request/api for candidate
router.post('/',async(req,res)=>{
    try{
       const data=req.body
       const newCandidate=new Candidate(data)
       const response=await newCandidate.save()
       //console.log("candidate saved:",response)
       res.status(200).json({response:response})
    }catch(err){
        console.error("Error during saving candidate:", err);
    res.status(500).json({ error: "Internal server error" });
    }
})