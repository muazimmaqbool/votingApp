const cors =require("cors")
const express = require("express");
const app = express();
//importing database connection
const db = require("./db");
require("dotenv").config()


// const {jwtAuthMiddleware}=require("./jwt")
app.use(cors({
  //origin: "http://localhost:5173",  // currently allowing to this url only
  origin:"https://votingappfront.netlify.app",
  credentials: true
}));

const bodyParser = require("body-parser");
app.use(bodyParser.json()); //here it will convert the json string/data to js object and save it inside: req.body
const PORT=process.env.PORT || 3000

//importing router files
const userRoutes=require("./Routes/userRoutes")
const candidateRoutes=require("./Routes/candidateRoute")

//using the routers
app.use('/user',userRoutes)
//now every operation/request which goes through /candidate API requires jwt Token
//Now jwtAuthMiddleware is applied inside candidateRoutes.js file
app.use('/candidate',candidateRoutes)


//just for testing: http://localhost:3000/
app.get("/", (req, res) => {
  res.send("Voting App Backend...");
});

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});