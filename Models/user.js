const mongoose=require('mongoose')
// const bycrypt=require("bcrypt")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true, 
    },
    age:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    phone:{
        type:String, //phone number is generally kept as string because it's country specific
        //required:true
    },
    address:{
        type:String,
        required:true,
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true, //aadhar card can't be repeated i.e one aadhar card number per user
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter', //by default who ever does signup will be a voter by default
    },
    isVoted:{ //has the user voted or not and by default the value is false
        type:Boolean,
        default:false
    }


})
const User=mongoose.model("User",userSchema);
module.exports=User