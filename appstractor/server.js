const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const capture = require('capture-chrome');
const fs = require('fs');

const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/' + 'appstraction';
const Appstraction = require('./models/appstraction.js');

//test variable 
const currentUser = {username: 'Username', email: 'first.last@gmail.com', password: '12345'}
// const data = [];

app.use(express.static('public'));
app.use(methodOverride('_method'));

//required parameters for exporting canvas body document as string 
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb', extended: true}));

//GET
//Index
app.get('/appstractor', (req,res) => {
    res.render('index.ejs');
});

//Create
app.get('/appstractor/render', (req,res) => {
    res.render('new.ejs');
});

//Iframe within Create
app.get('/appstractor/blank_canvas', (req,res) => {
    //server identifies current user to attach their username to their content
    res.render('blank_canvas.ejs',  {user: currentUser.username});
});

//Show + Edit 
app.get('/appstractor/gallery', (req,res) => {
    Appstraction.find({user: currentUser.username}, (err, data) => {
        res.render('show.ejs',{data: data});
    });
});

//Iframe within Show + Edit
app.get('/appstractor/saved_canvas/:id', (req,res) => {
    Appstraction.findById(req.params.id, (err, doc) => {
        res.render('saved_canvas.ejs',{doc: doc});
    });
}); 


//POST: Save
app.post('/appstractor/blank_canvas', (req, res) => {
    Appstraction.create(req.body, (err, doc) => {
        res.status(204).send();
    });
});

//POST: Download
//Needs to be done with id and not index to avoid capture-chrome cache error 
app.post('/appstractor/saved_canvas/:id', (req, res) => {
    capture({
        url: `http://localhost:3000/appstractor/saved_canvas/${req.params.id}`,
        width: 3600,
        height: 2400,
        }).then(screenshot => {
        fs.writeFileSync(`${__dirname}/public/saved/appstractor.png`, screenshot);
        console.log('image saved');
    });
    res.status(204).send();
});

//PUT
app.put('/appstractor/saved_canvas/:id', (req,res) => {
    Appstraction.findByIdAndUpdate(req.params.id,{$set: {dom: req.body.dom}}, {new: true}, (err, doc) => {
        res.status(204).send();
    });
});

//Delete
app.delete('/appstractor/saved_canvas/:id', (req, res) => {
    Appstraction.findByIdAndDelete(req.params.id, (err, doc) => {
        res.status(204).send();
    });
});

//Mongoose
mongoose.connect(mongoURI);

//Listen
app.listen(port, (req,res) => console.log('listening'));

