const mongoose=require('mongoose');

const blackListTokenSchema=mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:24*60*60   //In  seconds
    }  
})

module.exports=mongoose.model('blackListToken',blackListTokenSchema)