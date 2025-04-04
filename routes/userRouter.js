const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfilePic, uploadPfp, updateUserinfo, showFollowers, searchUsers, getUserByUid, followUserController, unFollowUserController, showFollowings, checkIfFollowing } = require('../controllers/userController');

//fetching user details
router.get('/userDetails', getUserDetails);
router.get('/getUserByUid/:uid',getUserByUid);

// customize profile
router.post('/changepfp/:uid', uploadPfp.single('pfp'), updateProfilePic);
router.post('/editProfile/:uid',updateUserinfo);

// fetch followers and followings
// for root user
router.get('/showFollowers',showFollowers);
router.get('/showFollowings',showFollowings);
// for other user
router.get('/showFollowers/:uid',showFollowers);
router.get('/showFollowings/:uid',showFollowings);


// search database for users
router.get('/search',searchUsers)

// follow and unfollow
router.post('/follow/:uid',followUserController);
router.delete('/unfollow/:uid',unFollowUserController);

//check if we are following the user or not?
router.get('/isFollowing/:fuid',checkIfFollowing);

module.exports = router;
