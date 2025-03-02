require('dotenv').config();
const jwt=require('jsonwebtoken');

const authenticateToken=(req,res,next)=>{
    const token=req.headers['authorization']?.split(" ")[1];
    console.log('authentication invoked');
    if(!token) return res.status(401).json({message:"Access denied"});
    
    // try{
    //     const verified=jwt.verify(token,process.env.SECRET_KEY);
    //     req.user=verified;
    //     next();
    // }catch(err){
    //     res.status(403).json({message:"Invalid Token"});
    // }
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:"Invalid or expired token"});
        }

        req.user=decoded;
        next();
    })
}

module.exports={authenticateToken};