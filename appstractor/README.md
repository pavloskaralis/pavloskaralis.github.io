
Live Link:

Art Credit:
Background from Unsplash (https://unsplash.com/photos/F8nUWfdo_AI)    
Icons from Vecteezy (https://www.vecteezy.com) and oNline Web Fonts (http://www.onlinewebfonts.com/icon) 

Purpose: Appstractor serves to provide users with a means of creating abstract art at the click of a button. 
Furthermore, the content can be downloaded in order to share online or print as wall art. 
Given that any image can be converted into an appstraction, there exists an infinite supply of source material for the user to render. 

Technologies: 
Node.js
Capture-Chrome (npm)
EJS
Iframe
Express
Mongoose

Technologies Overview:
This app relies on Node.js for its back end functionality. More specifically, the installed npm dependancies include:
express, mongoose, ejs, and capture-chrome. The server relies on an express object for its routing, and mongoose to connect it with mongoDB for data storage. Given the complexities of the rendering script, EJS was opted over JSX due to a greater familiarity 
of its dom manipulation techniques. The app's ability to download the browser window as a png file stems from the capture-chrome npm, which serves as an intermediary shortcut to puppeteer's screen capture feature. 

Note:
Given user authorization has not yet been implemented, a variable located in the controller file 
serves to simulate the app's functionality with a specified user. 

Approach:
The app begins on the index page, which 

index
new
create
show
edit
update
destroy


