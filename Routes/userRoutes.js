const express=require('express');
const router=express.Router();//used to manage routes
const User=require("../Models/user")
const {jwtAuthMiddleware,generateToken}=require("../jwt")

//POST request
router.post("/signup", async (req, res) => {
  try {
    //extracting data from request body
    const data=req.body;

    const newUser=new User(data)//creating new user document using User model

    //saving this new user to the database
    const response=await newUser.save();
    // console.log("newuser saved:",response)

    const payLoad={ //only user id will be in the payload
        id:response.id
    }
    const token=generateToken(payLoad)
    res.status(200).json({response:response,token:token})
  } catch (err) {
    console.error("Error saving person:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
