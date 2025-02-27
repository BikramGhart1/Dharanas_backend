const express=require('express');
const router=express.Router();
const loginController=require('../controllers/loginController');

router.post('/login',loginController.getLoginData);
router.post('/signin',loginController.getSignupData);

module.exports=router;