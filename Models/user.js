const mongoose=require('mongoose')
const bycrypt=require("bcrypt")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true, 
    },
    age:{
        type:Number,
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

//used to hash the password before saving it 
userSchema.pre('save',async function(next){
    const user=this; //basically this here is the existing records/schema of the user
    //first we will check is password being updated or now because it will be running on ever save, so if user is only updating name,address etc
    //in that case we won't hash password again if it has not being changed
    if(!user.isModified("password")) return next()
    try{
        //hash password generate

        //1: generating salt (here genSalt(10) means 10 round salt, generates random string)
        const salt=await bycrypt.genSalt(10); // we can also do this: const salt="this is a salt"; but not secure at all
        //console.log("salt:",salt) // $2b$10$UjvORRbdKDQVh3aXB3f6wO

        //2: hashing password
        const hashedPassword=await bycrypt.hash(user.password,salt)

        //3: overrides the plan password with the hashed one
        user.password=hashedPassword

        next(); //means we have done processing now you can save in db/do further tasks
    }catch(err){
        return next(err)
    }
})


//method comparePassword used to compare password entered by the user with the hashed password in db
userSchema.methods.comparePassword=async function(candidatePassword){
    try{
        //using bycrypt to compare provided password with hashed password
        const isMatch=await bycrypt.compare(candidatePassword,this.password)
        return isMatch;
    }catch(err){
        throw err;
    }
}
const User=mongoose.model("User",userSchema);
module.exports=User