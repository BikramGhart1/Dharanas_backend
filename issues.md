# Issues

# what's left to do
1. Check if the user already exists in the db while creating new acc
if user exists say user already exists and direct to login?
If user is new give them token

* cleared
2. create new routes and protect them 
3. When the user keeps choosing and uploading the profile picture they will be stored in the uploads directory
  but only one image will be in database so delete the rest of images  


* cleared
1. Delete old pfp images to save storage
2. image in upload directory not appearing in frontend (maybe issues with static serving)

(Omg I spent whole day trying to implement these two things finally fixed the issues)

* not cleared
3. Validate the form data coming from user/editProfile/:uid route and delete account too
4. Have users suggestions and make followers and following 
5. Then we move to post managements
6. Then comments

* mar 21 (cleared)
1. im using post request to insert in follow table but im getting user denied
check follower and followee id and make sure routes are matching plus in frontend see if axios post method is correct

* mar 22 (priority high)
1. fetch the followers and following and send to frontend