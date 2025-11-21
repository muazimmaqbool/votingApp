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
    const user = await User.findById(userId);
    return user.role === "admin"; //becomes true when user role is admin
  } catch (err) {
    return false;
  }
};

//post request/api for candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    //checking whether the user is admin or not
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user is not a admin!" });
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
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user is not a admin!" });
    }
    //getting ID
    const candidateId = req.params.candidateID;
    //getting updated data of candidate
    const updatedCandidateData = req.body;

    //saving candidate data
    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true, //will return the updated data
        runValidators: true, //runs data validation which is already setup in candidate.js model
      }
    );
    if (!response) {
      return res.status(403).json({ error: "Candidate not found" });
    }
    console.log("candidate dara updated", response);
    res.status(200).json({ message: "Caandidate updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete route for deleting candidate
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user is not a admin!" });
    }
    //getting ID
    const candidateId = req.params.candidateID;

    //deleting
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    // console.log("candidat deleted")
    res.status(200).json({ message: "Caandidate deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//getting list of candidates: (..../candidate/all)
router.get("/all", jwtAuthMiddleware, async (req, res) => {
  try {
    // if (!(await checkAdminRole(req.user.id))) {
    //   return res.status(403).json({ message: "user is not a admin!" });
    // }
    //const allCandidates=await Candidate.find()
    const allCandidates = await Candidate.find().select("name party"); //returns only name and party of the candidates
    res.status(200).json(allCandidates);
    //or
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//voting routes
//here in this route we will do: 1)Admin can't vote, 2)users can only vote,
router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  //getting candidate id from params and user id who is voting via jwt token's payload
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try {
    //getting candidate who's id is passed
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found!" });
    }

    //getting user who is voting
    const user =await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    //checking if user has already voted or not
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted!" });
    }

    //making sure admin is not allowed to vote
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin is not allowed to vote!" });
    }

    //updating candidate document when a user votes to record the vote
    candidate.votes.push({ user: userId }); //recording to voted
    candidate.voteCount++; //updating vote cound of the candidate
    await candidate.save();

    //updating user document to update a user who vote
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//getting vote count
//This route will return the vote count of each party and in sorted order
router.get("/vote/count", async (req, res) => {
  try {
    const allCandidates = await Candidate.find().sort({ voteCount: "desc" });
    //returning only name of the part and vote count
    const voteRecord = allCandidates.map((data) => {
      return {
        party: data?.party,
        count: data?.voteCount,
      };
    });
    res.status(200).json(voteRecord);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
