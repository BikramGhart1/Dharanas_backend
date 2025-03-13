const pool = require('./db');

const getUserByEmail = async (email) => {
   try {
      const results = await pool.query('SELECT uid,username,created_at,email,profile_picture FROM users WHERE email=$1', [email]);
      console.log('user queriy results: ', results.rows[0]);
      return results.rows[0];
   } catch (err) {
      throw err;
   }
}

const updateProfilePic = async (uid, imageURL) => {
   try {
      const results = await pool.query('UPDATE users SET profile_picture=$1 WHERE uid=$2 RETURNING profile_picture AS profile_picture', [imageURL, uid]);
      console.log('pfp queriy results: ', results.rows[0]);

      return results.rows[0];
   } catch (err) {
      throw err;
   }
}


module.exports = { getUserByEmail, updateProfilePic }