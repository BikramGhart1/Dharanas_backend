const userQueries = require('../database/userQueries');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

//multer configuration
const pfpStorage = multer.diskStorage({
   destination: function (req, file, cb) {
      const userId = req.params.uid;
      console.log(userId);
      if (!userId) {
         return cb(new Error("userId is missing in the request body"), null);
      }
      const userDir = path.join(__dirname, '..', 'uploads', 'users', userId, 'pfp');


      //if above directory doesnt exists then make it
      try {
         if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
            console.log("Dir created at: ", userDir);
         }
      } catch (err) {
         console.error('Error creating the dir: ', err);
         return cb(err, null);
      }
      cb(null, userDir);
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});

const uploadPfp = multer({ storage: pfpStorage })


const addBaseURL = (req, profile_picture) => {
   const baseURL = `http://${req.headers.host}`

   return `${baseURL}${profile_picture}`
}

const addBaseURLInArray = (req, users) => {
   return users.map((user) => {
      if (user.profile_picture == null) {
         user.profile_picture = '/images/guest.png';
      } else {
         user.profile_picture = addBaseURL(req, user.profile_picture);
      }
      return user;
   })
}

const getUserDetails = async (req, res, next) => {
   try {
      const user = await userQueries.getUserByEmail(req.user.email);

      //send profile picture by adding base url after fetching from database.
      if (user.profile_picture !== null) {
         const baseURL = `http://${req.headers.host}`
         const relativePfpURL = user.profile_picture;

         user.profile_picture = `${baseURL}${relativePfpURL}`
      }
      res.status(200).json({ user });

   } catch (err) {
      console.error("Error in getting user details: ", err);
      res.status(500).json({ message: "server error" })
   }
}


const getUserByUid = async (req, res, next) => {
   try {
      const uid = req.params.uid;

      console.log('get user by uid invoked ', uid);
      if (!uid) {
         return res.status(400).json({ message: "No uid found" });
      }

      const user = await userQueries.getUserByUidQuery(uid);

      if (user.profile_picture === null) {
         user.profile_picture = '/images/guest.png';
      } else {
         user.profile_picture = addBaseURL(req, user.profile_picture);
      }

      res.status(200).json({ data: user, message: "Data Fetched successfully" });
   } catch (err) {
      console.error("Error during frtching user using uid: ", err);
      res.status(500).json({ message: "Error occurred during fetching user by uid" });
   }
}

const updateProfilePic = async (req, res, next) => {
   console.log("Profile change");
   const uid = req.params.uid;
   const imageFile = req.file;

   try {
      if (!imageFile) {
         return res.status(400).json({ message: "No file uploaded" });

      }

      const baseURL = `http://${req.headers.host}`
      const imageURL = `/uploads/users/${uid}/pfp/${imageFile.filename}`
      console.log('image url after getting from multer: ', imageURL);

      const userDetails = await userQueries.getUserByEmail(req.user.email);
      const oldPfp = userDetails.profile_picture;
      // console.log('old pfp relative path', oldPfp);

      //store in database
      const user = await userQueries.updateProfilePic(uid, imageURL)
      console.log('old pfp once again after updating the db: ', oldPfp);

      //if old images exist delete them
      if (oldPfp) {
         const oldPfpPath = path.join(__dirname, "..", oldPfp)
         console.log('old pfp full path: ', oldPfpPath)
         if (fs.existsSync(oldPfpPath)) {
            console.log('deleting old picture: ', oldPfpPath);
            fs.unlinkSync(oldPfpPath);
         }
      }

      const newPfp = user.profile_picture;
      const newPfpURL = `${baseURL}${newPfp}`
      console.log('new pfp url ready to send: ', newPfpURL)
      res.status(200).json({ pfp: newPfpURL, message: "pdp updated successfully" });
   } catch (err) {
      console.error("Error while updating pfp: ", err);

      if (imageFile) {
         const newPfpPath = path.join(__dirname, 'uploads', 'users', uid, 'pfp', imageFile.filename)

         if (fs.existsSync(newPfpPath)) {
            fs.unlinkSync(newPfpPath);
         }

      }
      res.status(500).json({ message: "Updation Failed" });
   }
}


const updateUserinfo = async (req, res, next) => {
   try {
      const uid = req.params.uid;
      const { username, bio } = req.body;
      const user = await userQueries.updateUserinfo(uid, username, bio);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }
      console.log('user data after updation: ', user);
      res.status(200).json({ data: user, message: "User updated successfully" });
   } catch (err) {
      console.error('error while updating the user details: ', err);
      res.status(500).json({ message: "User updations failed" });
   }
}

const showFollowers = async (req, res, next) => {
   try {
      const uid = req.params.uid || req.user.uid;
      console.log('user uid: ', uid);
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      console.log('followers: limit, page, offset', limit, page, offset);
      const users = await userQueries.fetchfollowers(uid, limit, offset);

      if (users.length === 0) {
         console.log('No followers found');
         return res.status(200).json({ data: [], total_followers: 0 });
      }
      const total_followers = users[0].total_followers || 0;
      const pfpAddedUsers = addBaseURLInArray(req, users);

      console.log('fetching followers controller: ', pfpAddedUsers);
      res.status(200).json({ data: pfpAddedUsers, total_followers: total_followers });
   } catch (err) {
      console.error('Error during getting followers: ', err);
      res.status(500).json({ message: "followers fetching failed" });
   }
}

const showFollowings = async (req, res, next) => {
   try {
      const uid = req.params.uid || req.user.uid;
      console.log('uid of user: ', uid);
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      console.log('followings: limit, page, offset', limit, page, offset);

      const users = await userQueries.fetchFollowings(uid, limit, offset);

      if (users.length === 0) {
         console.log('empty array following');
         return res.status(200).json({ data: [], total_followings: 0 });
      }

      const total_followings = users[0].total_followings || 0;
      const pfpAddedUsers = addBaseURLInArray(req, users);
      console.log('fetching followings controller: ', pfpAddedUsers);
      res.status(200).json({ data: pfpAddedUsers, total_followings: total_followings });
   } catch (err) {

      console.error('Error during getting followings: ', err);
      res.status(500).json({ message: "followings fetching failed" });
   }
}

const searchUsers = async (req, res, next) => {
   try {
      console.log('search invoked')
      const { query } = req.query;

      if (!query || query.trim() === '') {
         return res.status(200).json({ data: [], message: "No users found" })
      }
      const users = await userQueries.searchUsers(query);

      const pfpAddedUsers = addBaseURLInArray(req, users);


      res.status(200).json({ data: pfpAddedUsers.length > 0 ? pfpAddedUsers : [], message: pfpAddedUsers.length > 0 ? "Users found" : "No users found" })
   } catch (err) {
      console.error('Error during seearching the users: ', err);
      res.status(500).json({ message: "Error occured during searching users" });
   }
}

const searchScopedUsers = async (req, res, next) => {
   const { query } = req.query;
   const uid = req.params.uid || req.user.uid;
   const scope=req.params.scope;
   if (!query || query.trim() === '') {
      return res.status(200).json({ data: [], message: "no search query found" });
   }

   try {
      let users = [];
      if (scope === 'followers') {
         users = await userQueries.searchFollowers(uid,query);
      } else if (scope === 'followings') {
         users = await userQueries.searchFollowings(uid,query);
      } else {
         return res.status(400).json({ data: [], message: 'invalid scope' });
      }

      const usersWithAddedPfpUrl = addBaseURLInArray(req, users)
      res.status(200).json({data:usersWithAddedPfpUrl,message:usersWithAddedPfpUrl.length>0?"Users found":"No users found"});
   } catch (err) {
      console.error("Error while searching followers or followings: ",err);
      res.status(500).json({message:'Server error'});
   }
}

const followUserController = async (req, res, next) => {
   try {
      console.log('follow user invoked');
      const followee_id = req.body.uid;
      const follower_id = req.user.uid;

      console.log('follower id: ', follower_id);
      console.log('followee id:', followee_id);

      if (!followee_id || !follower_id) {
         console.log("Either followee or follower's id not found!");
         return res.status(404).json({ message: "Either followee or follower's id not found!" });
      }
      const result = await userQueries.followUser(follower_id, followee_id);
      res.status(200).json({ data: result.data, message: "Successfully followed the user" });

   } catch (err) {
      if (err.code === '23505') {
         return res.status(400).json({ message: "You are already following this user" });
      }
      console.error("Error while Following a user: ", err);
      res.status(500).json({ message: "Error occurred while following a user" });
   }
}
const unFollowUserController = async (req, res, next) => {
   try {
      console.log('unfollowing user');

      const followee_id = req.params.uid;
      const follower_id = req.user.uid;

      const result = await userQueries.unFollowUser(follower_id, followee_id);

      if (result === 0) {
         res.status(404).json({ message: "You are not even following this user" });
      }
      res.status(200).json({ message: "you got rid of this user successfully" });
   } catch (err) {
      console.error('Errro occured while unfollowing: ', err);
      res.status(500).json({ message: "Server Error" });
   }
}
const checkIfFollowing = async (req, res, next) => {
   try {
      const following_uid = req.params.fuid;
      const userId = req.user.uid;

      const resultRowCount = await userQueries.isFollowing(following_uid, userId);
      res.json({ isFollowing: resultRowCount > 0 });
   } catch (err) {
      console.error("Error during checking if we following the user: ", err);
      res.status(500).json({ message: "Internal server error" });
   }
}
module.exports = { getUserDetails, getUserByUid, updateProfilePic, updateUserinfo, showFollowers, showFollowings, searchUsers, followUserController, unFollowUserController, checkIfFollowing, searchScopedUsers, uploadPfp };