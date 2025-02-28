const pool=require('./db')

const getUserByEmail=async (email)=>{
    try{
        const result=await pool.query('SELECT email, password FROM users WHERE email=$1',[email]);
        return result.rows[0];
    }catch(err){
        throw err;
    }

}
const createUser=async(email,username,hashedPassword)=>{
    try{
        const result=await pool.query('INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING uid, email, username',[username,email,hashedPassword]);
        return result.rows[0];
    }catch(err){
        throw err;
    }
} 
module.exports={getUserByEmail, createUser}