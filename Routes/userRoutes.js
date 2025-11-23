const express = require("express");
const router = express.Router(); //used to manage routes
const User = require("../Models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//POST request (singup route)
//api like thid: /user/singup
router.post("/signup", async (req, res) => {
  try {
    //extracting data from request body
    const data = req.body;

    // Check if there is already an admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }

    const newUser = new User(data); //creating new user document using User model

    //saving this new user to the database
    const response = await newUser.save();
    // console.log("newuser saved:",response)

    const payLoad = {
      //only user id will be in the payload
      id: response.id,
    };
    const token = generateToken(payLoad);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.error("Error during saving user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    //getting aadhardCardNumber and password
    const { aadharCardNumber, password } = req.body;

    //getting user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    //if user is not found or either password or aadharCardNumber is wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json("Invalid username or password");
    }

    const payload = {
      id: user.id,
      role:user.role,
    };
    const token = generateToken(payload);
    res.status(200).json({ token :token,name:user.name,role:user.role});
  } catch (err) {
    console.log("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user; //basically payload from jwt token
    //getting id
    const userId = userData.id;
    //getting user details
    const user = await User.findById(userId);
    // console.log("user:",user)
    res.status(200).json({ userProfile: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//route to change the password
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userID = req.user; //getting the id from the jwt payload
    //getting currentpassword and new password from request body
    const { currentPassword, newPassword } = req.body;
    // console.log("currentPassword:",currentPassword)
    // console.log("newPassword:",newPassword)
    const id=userID?.id;
    // console.log("id:",id)
    //checking the user is preent or not by the userId
    const user = await User.findById(id);
    // console.log("user:",user)
    

    //if current password doesn't match then return error
    if (!(await user.comparePassword(currentPassword))) {
      console.log("called...")
      return res.status(401).json({ error: "Invalid current password!" });
    }

    //updating users password
    user.password = newPassword;
    await user.save();

    console.log("Password Updated");
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//updating user profile by user id
router.put("/:userID", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.userID;
    const updatedUserData = req.body;
    //saving candidate data
    const response = await User.findByIdAndUpdate(
      userId,
      updatedUserData,
      {
        new: true, //will return the updated data
        runValidators: true, //runs data validation which is already setup
      }
    );
    // console.log("response:",response)
    if (!response) {
      return res.status(403).json({ error: "User not found" });
    }
    // console.log("candidate dara updated", response);
    res.status(200).json({ message: "User profile updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//getting list of users/voters
router.get('/all',jwtAuthMiddleware,async(re1,res)=>{
  try{
    const allVoters=await User.find({role:"voter"})
    res.status(200).json(allVoters)
  }catch(error){
    res.status(500).json({error:"Internal server error"})
  }
})
module.exports = router;
