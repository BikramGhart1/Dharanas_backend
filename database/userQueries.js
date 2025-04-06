const pool = require('./db');

const getUserByEmail = async (email) => {
   try {
      const results = await pool.query('SELECT uid,username,bio,created_at,email,profile_picture FROM users WHERE email=$1', [email]);
      console.log('get user by email query: ', results.rows[0])
      return results.rows[0];
   } catch (err) {
      throw err;
   }
}
const getUserByUidQuery = async (uid) => {
   try {
      const result = await pool.query('SELECT uid, username, email, bio, profile_picture, created_at FROM users WHERE uid=$1', [uid]);
      console.log('user fetch result: ', result.rows);
      console.log('user fetch result 0: ', result.rows[0]);
      return result.rows[0];
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

const fetchfollowers = async (providedUID, limit, offset) => {
   try {
      const results = await pool.query(
         'SELECT u.username, u.profile_picture, u.bio, u.uid, COUNT(f.follower_id) OVER() AS total_followers FROM users u JOIN follows f ON u.uid=f.follower_id WHERE f.followee_id=$1 ORDER BY f.created_at DESC LIMIT $2 OFFSET $3', [providedUID, limit, offset]);
      console.log('fetch followers in query: ', results.rows)
      return results.rows;
   } catch (err) {
      throw err;
   }
}

const fetchFollowings = async (providedUID, limit, offset) => {
   try {
      const results = await pool.query(
         'SELECT u.username, u.profile_picture, u.bio, u.uid, COUNT(f.followee_id) OVER() AS total_followings FROM users u JOIN follows f ON u.uid=f.followee_id WHERE f.follower_id=$1 ORDER BY f.created_at DESC LIMIT $2 OFFSET $3', [providedUID, limit, offset]);
      console.log('fetching following in queries: ', results.rows)
      return results.rows;
   } catch (err) {
      throw err;
   }
}
const searchUsers = async (searchTerm) => {
   try {
      const results = await pool.query('SELECT uid,username,profile_picture FROM users WHERE username ILIKE $1 LIMIT 20', [`${searchTerm}%`])
      console.log("search query results: ", results.rows);
      return results.rows;
   } catch (err) {
      throw err;
   }
}
const searchFollowers = async (userId,searchTerm) => {
   const query=`
                SELECT uid,username,profile_picture
                FROM users u
                JOIN follows f
                ON u.uid=f.follower_id
                WHERE f.followee_id=$1
                AND u.username ILIKE $2
                LIMIT 20
   `;
   try {
      const result = await pool.query(query, [userId,`${searchTerm}%`]);
      console.log('search followers:', result.rows);
      return result.rows;
   } catch (err) {
      throw err;
   }
}
const searchFollowings = async (userId,searchTerm) => {
   const query=`
        SELECT uid, username, profile_picture
        FROM users u
        JOIN follows f
        ON u.uid=f.followee_id
        WHERE f.follower_id=$1 
        AND u.username ILIKE $2 
        LIMIT 20
   `
   try {
      const result = await pool.query(query, [userId,`${searchTerm}%`]);
      console.log('search followers:', result.rows);
      return result.rows;
   } catch (err) {
      throw err;
   }
}
const followUser = async (followerId, followeeId) => {
   try {
      const result = await pool.query('INSERT INTO follows(follower_id,followee_id) VALUES ($1,$2) RETURNING *', [followerId, followeeId]);
      console.log('follow query results: ', result.rows[0]);
      return result.rows[0];
   } catch (err) {
      throw err;
   }
}

const unFollowUser = async (followerId, followeeId) => {
   try {
      const result = await pool.query('DELETE FROM follows WHERE follower_id=$1 AND followee_id=$2', [followerId, followeeId]);
      console.log('unfolloweing');
      return result.rowCount;
   } catch (err) {
      throw err;
   }
}

const isFollowing = async (following_uid, userId) => {
   try {
      const result = await pool.query('SELECT 1 FROM follows WHERE follower_id=$1 AND followee_id=$2', [userId, following_uid]);
      return result.rowCount;
   } catch (err) {
      throw err;
   }
}
module.exports = { getUserByEmail, getUserByUidQuery, updateProfilePic, updateUserinfo, fetchfollowers, fetchFollowings, searchUsers, searchFollowers, searchFollowings, followUser, unFollowUser, isFollowing }