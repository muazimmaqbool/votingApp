const express=require('express');
const router=express.Router();//used to manage routes
const User=require("../Models/user")
const {jwtAuthMiddleware,generateToken}=require("../jwt")

//POST request (singup route)
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
    console.error("Error during saving user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//login route
router.post('/login',async(req,res)=>{
    try{
        //getting aadhardCardNumber and password
        const{aadharCardNumber,password}=req.body;

        //getting user by aadharCardNumber
        const user=await User.findOne({aadharCardNumber:aadharCardNumber})

        //if user is not found or either password or aadharCardNumber is wrong
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json("Invalid username or password")
        }

        const payload={
            id:user.id
        }
        const token=generateToken(payload)
        res.status(200).json({token})
    }catch(err){
        console.log("Error during login:",err);
        res.status(500).json({error:"Internal server error"})
    }
})

//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try{
    const userData=req.user //basically payload from jwt token
    //getting id
    const userId=userData.id;
    //getting user details
    const user=await Person.findById(userId)
    res.status(200).json({userProfile:user})
  }catch(err){
    console.log(err)
    res.status(500).json({error:"Internal server error"})
  }
})
