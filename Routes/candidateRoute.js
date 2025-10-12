const express = require("express");
const router = express.Router(); //used to manage routes
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const Candidate = require("../Models/candidate");

//post request/api for candidate
router.post("/", async (req, res) => {
  try {
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

module.exports=router