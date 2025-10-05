const mongoose=require('mongoose') 
require("dotenv").config();

//Note:-> the mongodb server runs on this port: mongodb://localhost:27017/dbName

//step 1: Defining the MongoDB connection URl:
//const mongoDbURL='mongodb://localhost:27017/hotels' //here hotels can be any name
const mongoDbURL=process.env.LOCAL_DB_URL

//these two paramters are passed because otherwise you will get some warning, they make sure that you are working with latest versions
mongoose.connect(mongoDbURL,{
     useNewUrlParser: true,
    // useUnifiedTopology: true, //when using local DB connnection comment this line
})
.then(() => console.log("Connected to MongoDB server!"))
.catch((error) => console.log("MongoDB server connection error:", error));

//step 3: Access to default connection object:
/* mongoose maintains a default connection object representing the mongodb connection
->this object is what you'll use to handle events and interact with the database
its inside db and we got this via mongoose.connection */
//this 'db' represents a mongodb connection
const db=mongoose.connection;

//step 4: Define event listeners: 
/* you define event listeners for the databse connection using methods like:
   .on('connected',..), on('error',...) and .on('disconnected',...) 
   -> these events allow you to react to different states of the database connection
*/
db.on('connected',()=>{
    console.log("Connected to MongoDB server!")
})
db.on('error',(error)=>{
    console.log("MongoDB Server connection error:",error)
})
db.on('disconnected',()=>{
    console.log("MongoDB Server is disconnected!")
})


//step 5: Export the database connection:
/*
Finally, you export the db object, which represents the MongoDB connection, so that you can import and use
it in other parts of your Node.js application.
*/
module.exports=db;
//its imported/used inside myServer.js and also in server.js
/*
When this db object is exported in the express/server file you can use it to interact with the database,
when your server runs, it typically requires or imports this db.js file to establish the database connection before handling HTTP reqiests
*/