const express=require('express');
const router=express.Router();
const loginController=require('../controllers/loginController');
const validateSignIn=require('../form_validation/validatesigninform');

router.post('/login',validateSignIn.validateLogin,loginController.getLoginData);
router.post('/signin',validateSignIn.validateSignUp,loginController.signUpCreateUser);

module.exports=router;