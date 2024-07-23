
# Introduction

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 

# Before starting the app
Location and Venue data are automatically fetched from LSCD dataset. 
However, database for user requires manual input.

Please download project.users.json provided and import it into users database locally by using MongoDB compass, by connecting to `mongodb://127.0.0.1:27017/project` .

Similarly, import project.locs.json to locs database locally by using MongoDB compass. **Only added comments for "Hong Kong Cultural Centre (Concert Hall)"**

# Starting the app
# `cd .\project\`
Then
# `npm install`
install all dependencies.
# `npm run aio`
This script will build the application and start up the app.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# After starting up

The index page consists of a slideshow of event photos, a calendar, when clicked, showing events will be having that day.

On the top right, we have login box, upon clicking, a login form will pop up and ask you to enter username and password.

You may register your own account in the index page. Note password need to be 6 to 20 characters, with at least one character and one number.
This ONLY registered ones as normal users, but not admins.

You may use the following built-in username and password. 

Normal user: 
username: `username`
password: `password1`

Admin:
username: `admin`
password: `adminpw1`

# For normal user
You will first see a map consist of all 10 location, which each label linked to the individual view for an location.

On the top right, you will see your username and upon clicking, show a logout button for logout.

On the left, there is a navbar linked to 4 components, Home, Event, Location, and Favourite. Each showing the required materials.

# For admin user

Similar layout with normal user, but you can only operate CRUD actions on User database and Event database.

# Declaration 
We have read this article carefully:
https://www.cuhk.edu.hk/policy/academichonesty/ 
