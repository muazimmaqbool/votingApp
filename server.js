const express = require("express");
const app = express();
//importing database connection
// const db = require("./db");

const bodyParser = require("body-parser");
app.use(bodyParser.json()); //here it will convert the json string/data to js object and save it inside: req.body
const PORT=process.env.PORT || 3000

//importing router files
const userRoutes=require("./Models/user")

//using the routers
app.use('/user',userRoutes)

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});