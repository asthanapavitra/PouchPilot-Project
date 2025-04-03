const jwt=require('jsonwebtoken')
const BlackListToken=require('../models/blackListToken-model');
const Admin=require('../models/admin-model')
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
        let admin=await Admin.findOne({_id:decoded.id});
        if(!admin){
            return res.status(401).json({error:"Unauthorized, please login"});
        }
        req.admin=admin;
        next();
        
    }catch(err){
        return res.status(500).json({error:"Internal server error",message:err.message});
    }
}