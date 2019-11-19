const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const data = [];
const capture = require('capture-chrome');
const fs = require('fs');

// const mongoose = require('mongoose');
// const mongooseURI = 'mongodb://localhost:27017/' + `appstraction`;
// const db = mongoose.connect; 
// const appstraction = require('/./models/appstraction.js');

app.use(express.static('public'));

app.use(methodOverride('_method'));

//required parameters for exporting canvas body document as string 
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb', extended: true}));

//GET
//Index
app.get('/appstractor', (req,res) => {
    res.render('home.ejs');
});

//Create
app.get('/appstractor/render', (req,res) => {
    res.render('render.ejs');
});

//Iframe within Create
app.get('/appstractor/blank_canvas', (req,res) => {
    res.render('blank_canvas.ejs');
});

//Show
app.get('/appstractor/gallery', (req,res) => {
    res.render('gallery.ejs',{data: data});  
});

//Iframe within Show
app.get('/appstractor/saved_canvas/:index', (req,res) => {
    res.render('saved_canvas.ejs',{data: data, doc: data[req.params.index]});
}); 

//POST: Save
app.post('/appstractor/blank_canvas/save', (req, res) => {
    //creates document
    const document = {
        id: Math.round(Math.random() * 1000000), 
        dom: req.body.dom,
    }
    data.push(document);
    res.status(204).send();
});

//POST: Download
app.post('/appstractor/saved_canvas/:index/download', (req, res) => {
    capture({
        url: `http://localhost:3000/appstractor/saved_canvas/${req.params.index}`,
        width: 3600,
        height: 2400,
        }).then(screenshot => {
        fs.writeFileSync(`${__dirname}/public/saved/appstractor.png`, screenshot);
        console.log('image saved');
    });
    res.status(204).send();
});

//Delete
app.delete('/appstractor/saved_canvas/:index', (req, res) => {
    data.splice(req.params.index, 1);
    res.status(204).send();
});

//Mongoose
// mongoose.connect(mongoURI);

//Listen
app.listen(port, (req,res) => console.log('listening'));

