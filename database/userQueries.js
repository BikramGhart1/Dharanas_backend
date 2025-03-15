const pool = require('./db');

const getUserByEmail = async (email) => {
   try {
      const results = await pool.query('SELECT uid,username,bio,created_at,email,profile_picture FROM users WHERE email=$1', [email]);
      return results.rows[0];
   } catch (err) {
      throw err;
   }
}

const updateProfilePic = async (uid, imageURL) => {
   try {
      const results = await pool.query('UPDATE users SET profile_picture=$1 WHERE uid=$2 RETURNING profile_picture AS profile_picture', [imageURL, uid]);
      return results.rows[0];
   } catch (err) {
      throw err;
   }
}

const updateUserinfo = async (uid, username, bio) => {
   try {
      const results = await pool.query('UPDATE users SET username=$1, bio=$2 WHERE uid=$3 RETURNING username, bio', [username, bio, uid]);
      return results.rows[0];
   } catch (err) {
      throw err;
   }
}
module.exports = { getUserByEmail, updateProfilePic, updateUserinfo }