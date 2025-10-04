const mongoose=require('mongoose')
// const bycrypt=require("bcrypt")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true, 
    },
})
const User=mongoose.model("User",userSchema);
module.exports=User