const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const data = [];
const capture = require('capture-chrome');
const fs = require('fs');

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

//PUT
app.put('/appstractor/render/new', (req, res) => {
    //creates document
    const document = {
        index: data.length,
        dom: req.body.dom,
        img: `/../saved/appstractor${data.length}.png`
    }
    data.push(document);
    //once document is created, its dom property can be passed to /saved/:index to be rendered, then captured 
    capture({
        url: `http://localhost:3000/appstractor/saved_canvas/${data.length - 1}`,
        width: 3600,
        height: 2400,
        }).then(screenshot => {
        fs.writeFileSync(`${__dirname}/public/saved/appstractor${data.length - 1}.png`, screenshot)
        console.log('image saved')
    });
    res.status(204).send();
});

//Listen
app.listen(port, (req,res) => console.log('listening'));