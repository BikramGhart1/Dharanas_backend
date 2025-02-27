require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const tempDB = {
    email: "ram@gmail.com",
    password: bcrypt.hashSync("hashed1234", 10),
}


const getLoginData = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const isPasswordValid = bcrypt.compareSync(password, tempDB.password); 
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Either password or email is invalid" });
        }
        const token = jwt.sign({ email: tempDB.email }, SECRET_KEY, { expiresIn: "24h" });
        res.status(200).json({ token, message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const getSignupData = async (req, res, next) => {
    const { email, password, username } = req.body;
    console.log(email, password, username);
    res.status(200).json({ message: "Sign in data received" });
}
module.exports = { getLoginData, getSignupData }