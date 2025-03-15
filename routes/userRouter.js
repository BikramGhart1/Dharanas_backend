const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfilePic, uploadPfp, updateUserinfo } = require('../controllers/userController');


router.get('/userDetails', getUserDetails);
router.post('/changepfp/:uid', uploadPfp.single('pfp'), updateProfilePic);
router.post('/editProfile/:uid',updateUserinfo);

module.exports = router;
