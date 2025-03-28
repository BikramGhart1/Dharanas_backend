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
Base url (for development): localhost
* will update after deployment

> baseurl/signup

> baseurl/user

## Authentication
After user logs in a token will be provided and this token needs to be passed on header of the request as authorization

``` 
 {
     headers: {
                  Authorization: `Bearer ${token}`,
                },  
}
```
## Overview
| Method | Endpoint           | Description                  | Authentication |
|--------|-------------------|------------------------------|----------------|
| POST   | `/signup/signin`   | Register a new user         | No |
| POST   | `/signup/login`    | Authenticate user & get token | No |
| GET    | `/user/userDetails`| Fetch user details | Yes (Bearer Token) |


(I will update error status code too)

## Routes
## signup routes
### 1. POST/signin
Creates a new user and stores in database

#### Request:
- **URL**: 'signup/signin'
- **Method**: 'POST'
- **Content-Type**: 'application/json'
- **Request Body**:  
```
 {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "strongpassword",
    "confirmPassword":"strongPassword"
 }
```

#### Response:
- Success (200 OK):
```
{
    data:{
    "uid":uid,
    "email":email, 
    "username":"username"
    },
    "message": "Account created successfully"
}
```

### 2. POST/login
checks the already existing user's email and hashed password and authenticates the user by 
passing the token to client. This token can be used as an authenticater to access the protected routes 

#### Request:
- **URL**: 'signup/login'
- **Method**: 'POST'
- **Content-Type**: 'application/json'
- **Request Body**:  
```
{
 email:'example@gmail.com', 
 password:'strongpassword',
}
```

#### Response:
- Success (200 OK):
```
{
 token,  
 message: "Login successful"
}
```

## User Routes
URL: baseurl/user

* All the child routes of user routes are protected routes 
so from frontend side a token must be passed as authentication in request's header.

## fetching user details
### 1. GET/userDetails
This route fetches user details (uid,username,bio,created_at,email and profile_picture) from the database
using email

#### Request:
- **URL**: 'user/userDetails'
- **Method**: 'GET'
- **Content-Type**: 'application/json'
- **Request Body**:  {}
- **Authentication**:
```
{
    headers: {
                    Authorization: `Bearer ${token}`
                }
}
```

#### Response:
- Success (200 OK):
```
{
    uid:'',
    username:'',
    bio,created_at:'',
    email:'',
    profile_picture:''
}
```

router.get('/getUserByUid/:uid',getUserByUid);

# Setup
1. npm install

2. npm run devStart

# Make sure the server is running and ready to serve the client 