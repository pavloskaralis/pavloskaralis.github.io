const express = require('express');
const router = express.Router();
const capture = require('capture-chrome');
const fs = require('fs');
const Appstraction = require('../models/appstraction.js');
//test variable 
const currentUser = {username: 'Username', email: 'first.last@gmail.com', password: '12345'}

//GET
//Index
router.get('/', (req,res) => {
    res.render('index.ejs');
});

//Create
router.get('/render', (req,res) => {
    res.render('new.ejs');
});

//Iframe within Create
router.get('/blank_canvas', (req,res) => {
    //server identifies current user to attach their username to their content
    res.render('blank_canvas.ejs',  {user: currentUser.username});
});

//Show + Edit 
router.get('/gallery', (req,res) => {
    Appstraction.find({user: currentUser.username}, (err, data) => {
        res.render('show.ejs',{data: data, user: currentUser.username});
    });
});

//Iframe within Show + Edit
router.get('/saved_canvas/:id', (req,res) => {
    Appstraction.findById(req.params.id, (err, doc) => {
        res.render('saved_canvas.ejs',{doc: doc});
    });
}); 


//POST: Save
router.post('/blank_canvas', (req, res) => {
    Appstraction.create(req.body, (err, doc) => {
        res.status(204).send();
    });
});

//POST: Download
router.post('/saved_canvas/:id', (req, res) => {
        capture({
            url: `http://localhost:3000/appstractor/saved_canvas/${req.params.id}`,
            width: 3600,
            height: 2400,
            }).then(screenshot => {
            fs.writeFileSync(`${__dirname + '/../'}/public/saved/appstractorUsername.png`, screenshot);
            console.log('image saved');
        });
        res.status(204).send();
});

//PUT
router.put('/saved_canvas/:id', (req,res) => {
    Appstraction.findByIdAndUpdate(req.params.id,{$set: {dom: req.body.dom}}, {new: true}, (err, doc) => {
        res.status(204).send();
    });
});

//Delete
router.delete('/saved_canvas/:id', (req, res) => {
    Appstraction.findByIdAndDelete(req.params.id, (err, doc) => {
        res.status(204).send();
    });
});

module.exports = router; 


