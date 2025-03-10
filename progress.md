# what I've done
1. made login and sign in routes
2. made token passing in login controller
3. made token authenticator for protected routes 
4. implemented postgresql pool 
5. wrote sql queries for inserting and retreiveing the signup and login data from database
6. Used express-validator for sanitization and form validation

# what's left to do
1. Check if the user already exists in the db while creating new acc
if user exists say user already exists and direct to login?
If user is new give them token
2. create new routes and protect them
3. When the user keeps choosing and uploading the profile picture they will be stored in the uploads directory
  but only one image will be in database so delete the rest of images 
