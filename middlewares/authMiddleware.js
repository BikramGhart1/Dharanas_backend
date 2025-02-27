require('dotenv').config();
const jwt=require('jsonwebtoken');

const authenticateToken=(req,res,next)=>{
    const token=req.headers['Authorization']?.split(" ")[1];
    if(!token) return res.status(401).json({message:"Access denied"});
    
    try{
        const verified=jwt.verify(token,process.env.SECRET_KEY);
        req.user=verified;
        next();
    }catch(err){
        res.status(403).json({message:"Invalid Token"});
    }
}

module.exports=authenticateToken;