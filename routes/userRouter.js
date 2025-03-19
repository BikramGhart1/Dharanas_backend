const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfilePic, uploadPfp, updateUserinfo, showFollowers, searchUsers, getUserByUid } = require('../controllers/userController');


router.get('/userDetails', getUserDetails);
router.get('/getUserByUid',getUserByUid);
router.post('/changepfp/:uid', uploadPfp.single('pfp'), updateProfilePic);
router.post('/editProfile/:uid',updateUserinfo);
router.get('/showFollowers',showFollowers);
router.get('/search',searchUsers)

module.exports = router;
