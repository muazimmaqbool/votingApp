const jwt =require('jsonwebtoken')
//creating middleware (this middle when passed to any route will make sure that whoever route you are accessing needs a token and then
//                      verifies the token if token is provided)
const jwtAuthMiddleware=(req,res,next)=>{
    //check the request header has authorization or not:
    const authorization=req.headers.authorization
    if(!authorization) return res.status(401).json({error:"Token Not Found!"})
    //extracting token from header
    const token=req.headers.authorization.split(' ')[1]; 
    //ff token is not passed:
    if(!token){
        res.status(401).json({error:'Unauthorized'})
    }

    //when token is present:
    try {
        //verifying the JWT token: it will return decoded payload
        const decodedPayload=jwt.verify(token,process.env.JWT_SECRET_KEY)

        //returing the decodedPayload to the user
        req.user=decodedPayload // req.payload=decode or req.user=decoded or req.endcoded etc
        next()
    } catch (error) {
        console.log(`Error in jwtAuthMiddleware: ${error}`)
        res.status(401),json({error:"Invalid Token"})
    }
}

//generate JWT token:
//token needs payload i.e userData that's why it takes parameter as user data or anyname
const generateToken=(userData)=>{
    //generating a new jwt token using user data
   // return jwt.sign(userData,process.env.JWT_SECRET_KEY)

    //Token with expiry in 8h i.e 30000/60=500 minutes then 500/60 = 8.33 hours
    return jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:30000}) //now generate token and check its expiry in jwt.io
    //Note make sure the payload i.e userData here in this case is object and if not object then do like this
    //return jwt.sign({userData},process.env.JWT_SECRET_KEY,{expiresIn:30000})

}
module.exports={jwtAuthMiddleware,generateToken}