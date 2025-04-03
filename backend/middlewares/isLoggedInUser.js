const jwt=require('jsonwebtoken')
const BlackListToken=require('../models/blackListToken-model');
const User=require('../models/user-model')
module.exports.isLoggedIn=async(req,res,next)=>{
    try{
        const token=req.cookies.token||req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({error:"Unauthorized,please login"});
        }
        const blackListToken=await BlackListToken.findOne({token});
        if(blackListToken){
            return res.status(401).json({error:"Unauthorized, please login"});
        }
        let decoded=jwt.verify(token,process.env.JWT_SECRET);
        let user=await User.findOne({_id:decoded.id});
        if(!user){
            return res.status(401).json({error:"Unauthorized, please login"});
        }
        req.user=user;
        next();
        
    }catch(err){
        return res.status(500).json({error:"Internal server error",message:err.message});
    }
}