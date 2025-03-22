const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfilePic, uploadPfp, updateUserinfo, showFollowers, searchUsers, getUserByUid, followUserController, unFollowUserController } = require('../controllers/userController');


router.get('/userDetails', getUserDetails);
router.get('/getUserByUid/:uid',getUserByUid);
router.post('/changepfp/:uid', uploadPfp.single('pfp'), updateProfilePic);
router.post('/editProfile/:uid',updateUserinfo);
router.get('/showFollowers',showFollowers);
router.get('/search',searchUsers)
router.post('/follow/:uid',followUserController);
router.delete('/follow/:uid',unFollowUserController);

module.exports = router;
