const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfilePic, uploadPfp } = require('../controllers/userController');


router.get('/userDetails', getUserDetails);
router.post('/changepfp/:uid', uploadPfp.single('pfp'), updateProfilePic);

module.exports = router;
