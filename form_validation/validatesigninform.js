const {body}=require('express-validator')

const validateLogin=[
    body('email')
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail(),
    body('password')
    .isLength({min:6}).withMessage('Password must be atleast 6 characters long')

];

const validateSignUp=[
    body('username')
    .isLength({min:1}).withMessage("Username can't be empty")
    .trim()
    .escape(),
    body('email')
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail(),
    body('password')
    .isLength({min:6}).withMessage('Password must be atleast 6 characters long'),
    //this is being accessed from req.body 
    body('confirmPassword')
    .custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Password must match');
        }
        return true;
    })
]

module.exports={validateLogin,validateSignUp}