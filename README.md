# MessManagement

## **What is this application?**

This is A full stack web application which replaces the 
physical use of card system in mess...it benefits the students so that the 
students only pay for food when they eat and replacing it 
with a more eco-friendly non paper digital only platform 
which is also very convenient . solves the problem of
Paperwork,student gets billed for each meal,wastage of food,less secure and less reliable


This is a Mess Management project where students can book a meal ,complaint,see dues etc. 

### **Dependencies Required**
1. Node.js
2. MongoDB

### **Installation and Running**

 Make sure mongoDB instance is running `sudo service mongod start`
 Install the relevant node.js dependencies `npm install`
 Start the server `npm start`
 
 ## **Student View**

* Students need to be signed up before they can do anything.
* They can write complaint reagarding any mess problem.they can see that there complaint has been considered or not
* They can request manager that they don't want to have meal and it not should be counted in there mess dues and food wastage will also not be there
* They can see there dues , messmenu,information regarding there meal.
* For student login go to `localhost:XXXX/student/login`

## **Admin View**

* * Admin need to be signed up before they can do anything.
* Admin can see complaints ,consider complaints , messmenu, change messmenu, see mess dues of each student, can see bookings, can see messprices, update mess prices etc.
* For admin login go to `localhost:XXXX/admin/login`

## **Manager View**

* Manager need to be signed up before they can do anything.
* Manager can see mess dues of each student, mess menu, can see students complaints,can see mess prices.
* For manager login go to `localhost:XXXX/manager/login`
