const express = require('express');
const router = express.Router();
const { getUserDetails, updateProfilePic, upload } = require('../controllers/userController');


router.get('/userDetails', getUserDetails);
router.post('/changepfp', upload.single('pfp'), updateProfilePic);

module.exports = router;