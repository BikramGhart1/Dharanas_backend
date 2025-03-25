# Overview
This project is a backend server for the website I'm building called 'Dharanas'. This web application is a 
simple social media like application. Purpose of this repository is to act as a backend server for that project
and interact with database.

# Features
1. User account registration and login with database
2. User authentication and authorization
3. Users can follow each other
4. Users search in database
5. User Profile customization
6. 

# Technologies and dependencies used in this repository
1. Node JS : Run JavaScript beside web browser
2. Express JS : Framework for Node js
3. Postgre SQL : Database
4. multer : File management
5. Express-validator : Form validation
6. bcrypt : hash password
7. JWT (JSON Web Token) : Token Based Authentication
8. dotenv : Configure env files
9. cors : Allow cross origin requests

# Database Structure Overview
* For security concerns I'm leaving most of the schema designs abstract
1. users table (stores user data)
2. follow table (keep tracks of user's follow relation)

# API Documentation 
## Overview
There are public and private routes, signup routes are public but rest of the routes require authentication 

### Base URL
Base url for now is localhost

> baseurl/signup

> baseurl/user

## Authentication
After user logs in a token will be provided and this token needs to be passed on header of the request as authorization

>  {

>     headers: {

>                  Authorization: `Bearer ${token}`,

>                },  

> }

## Routes
### signup route
1. POST/signin
Creates new user and stores in database

Request body:
> {

>    "username": "newuser",

>  "email": "newuser@example.com",

>  "password": "strongpassword",

>  "confirmPassword":"strongPassword"

> }


2. POST/login

# Setup
1. npm install
2. npm run devStart

# Make sure the server is running and ready to serve the client 