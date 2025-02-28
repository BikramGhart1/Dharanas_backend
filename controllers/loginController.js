require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const queries = require('../database/queries');
const { validationResult } = require('express-validator');
const saltRounds = 10;

const formErrHandling = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
}

const getLoginData = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        formErrHandling(req);

        //sql query to retreive the user from database by email
        const user = await queries.getUserByEmail(email);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Either password or email is invalid" });
        }
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "24h" });
        res.status(200).json({ token, message: "Login successful" });
    } catch (err) {
        console.error("Error in logindata: ",err);
        res.status(500).json({ message: "Server error" });
    }
}

const signUpCreateUser = async (req, res, next) => {
    try {
        //error handling for form validation
        formErrHandling(req);
     
        //get input fields datas from frontend and hash the password
        const { email, password, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //perform sql query to insert and create the user
        const user = await queries.createUser(email, username, hashedPassword);
        res.status(200).json({ user, message: "Account created successfully" });
    } catch (err) {
        console.error("Error in signupCreateUser: ", err);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { getLoginData, signUpCreateUser }