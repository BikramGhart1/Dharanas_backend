const loginQueries=require('../database/loginQueries');
const userQueries=require('../database/userQueries');

const getUserDetails=async(req,res,next)=>{
 console.log("Api invoked");   
 try{
    const user=await userQueries.getUserByEmail(req.user.email);
    res.status(200).json({user});

 }catch(err){
    console.error("Error in getting user details: ",err);
    res.status(500).json({message:"server error"})
 }
}

module.exports={getUserDetails};