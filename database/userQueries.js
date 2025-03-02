const pool=require('./db');

const getUserByEmail=async(email)=>{
  try{
    const results=await pool.query('SELECT uid,username,created_at,email FROM users WHERE email=$1',[email]);
    return results.rows[0];
  }catch(err){
     throw err;
  }
}

module.exports={getUserByEmail}