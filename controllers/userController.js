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


const getUserDetails = async (req, res, next) => {
   try {
      const user = await userQueries.getUserByEmail(req.user.email);

      //send profile picture by adding base url after fetching from database.
      const baseURL = `http://${req.headers.host}`
      const relativePfpURL = user.profile_picture;

      user.profile_picture = `${baseURL}${relativePfpURL}`
      res.status(200).json({ user });

   } catch (err) {
      console.error("Error in getting user details: ", err);
      res.status(500).json({ message: "server error" })
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
      if(!user){
         return res.status(404).json({message:"User not found"});
      }
      console.log('user data after updation: ', user);
      res.status(200).json({ data: user, message: "User updated successfully" });
   } catch (err) {
      console.error('error while updating the user details: ', err);
      res.status(500).json({ message: "User updations failed" });
   }
}

module.exports = { getUserDetails, updateProfilePic, updateUserinfo, uploadPfp };