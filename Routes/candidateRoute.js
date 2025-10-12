const express = require("express");
const router = express.Router(); //used to manage routes
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const Candidate = require("../Models/candidate");
const User = require("../Models/user");

//this function will make sure that only admin is allowed to perform some specific operations
//like creating candidate etc
//or this function makes sure only admin is allowed to use this candidate route

const checkAdminRole = async (userId) => {
  try {
    const user=await User.findById(userId);
    return user.role==="admin"; //becomes true when user role is admin
  } catch (err) {
    return false;
  }
};

//post request/api for candidate
router.post("/", async (req, res) => {
  try {
    //checking whether the user is admin or not
    if(!checkAdminRole(req.user.id)){
        return res.status(403).json({message:'user is not a admin!'})
    }
    const data = req.body; //geting candidate data from request body
    const newCandidate = new Candidate(data); //creating a new candidate document model
    const response = await newCandidate.save(); //saving new candidate to the db
    //console.log("candidate saved:",response)
    res.status(200).json({ response: response });
  } catch (err) {
    console.error("Error during saving candidate:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//used to update candidate data by candidate id
router.put("/:candidateID", async (req, res) => {
  try {
    if(!checkAdminRole(req.params.candidateID)){
        return res.status(403).json({message:'user is not a admin!'})
    }
    //getting ID
    const candidateId=req.params.candidateID;
    //getting updated data of candidate
    const updatedCandidateData=req.body

    //saving candidate data
    const response=await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{
        new:true, //will return the updated data
        runValidators:true, //runs data validation which is already setup in candidate.js model
    })
    if(!response){
        return res.status(403).json({error:'Candidate not found'})
    }
    console.log("candidate dara updated",response)
    res.status(200).json({message:"Caandidate updated"})

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete route for deleting candidate
router.delete("/:candidateID", async (req, res) => {
  try {
    if(!checkAdminRole(req.params.candidateID)){
        return res.status(403).json({message:'user is not a admin!'})
    }
    //getting ID
    const candidateId=req.params.candidateID;

    //deleting 
    const response=await Candidate.findByIdAndDelete(candidateId)
    if(!response){
        return res.status(404).json({error:'Candidate not found'})
    }
    console.log("candidat deleted",response)
    res.status(200).json({message:"Caandidate updated"})

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
