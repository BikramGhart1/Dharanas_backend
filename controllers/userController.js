const userQueries = require('../database/userQueries');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', '/uploads'));
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});

const upload = multer({ storage })

const getUserDetails = async (req, res, next) => {
   console.log("Api invoked");
   try {
      const user = await userQueries.getUserByEmail(req.user.email);
      res.status(200).json({ user });

   } catch (err) {
      console.error("Error in getting user details: ", err);
      res.status(500).json({ message: "server error" })
   }
}

const updateProfilePic = async (req, res, next) => {
   console.log("Profile change");
   try {
      const { uid } = req.body;
      const imageFile = req.file;
      console.log(imageFile);
      if (!imageFile) {
         res.status(400).json({ message: "No file uploaded" });
      }
      const baseURL = `http://${req.headers.host}`
      console.log('Base url: ', baseURL);
      const imageURL = `${baseURL}/uploads/${imageFile.filename}`

      const user = await userQueries.updateProfilePic(uid, imageURL)
      console.log('user: ', user);
      res.status(200).json({ data: user, message: "pdp updated successfully" });
   } catch (err) {
      console.error("Error while updating pfp: ", err);
      res.status(500).json({ message: "Server error" });
   }
}

module.exports = { getUserDetails, updateProfilePic, upload };