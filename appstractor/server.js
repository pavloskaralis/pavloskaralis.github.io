const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const data = [];
const capture = require('capture-chrome');
const fs = require('fs');

app.use(express.static('public'));

app.use(methodOverride('_method'));

app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb', extended: true}));

//GET
app.get('/appstractor', (req,res) => {
    res.render('index.ejs');
});

app.get('/appstractor/render', (req,res) => {
    res.render('render.ejs');
});

app.get('/appstractor/gallery', (req,res) => {
    capture({
        url: 'http://localhost:3000/appstractor/saved/',
        width: 3600,
        height: 2400,
        }).then(screenshot => {
        fs.writeFileSync(`${__dirname}/public/saved/example.png`, screenshot)
        console.log('open example.png')
    });
    res.render('gallery.ejs',{data:data});

    // res.render('gallery.ejs',{data:data});        
});

app.get('/appstractor/canvas', (req,res) => {
    res.render('canvas.ejs');
});

app.get('/appstractor/saved', (req,res) => {
    res.render('saved.ejs',{data: data[0]});
}); 
//PUT
app.put('/appstractor/gallery/new', (req, res) => {
    data.push(req.body.html);
    console.log(data);
});

//Listen
app.listen(port, (req,res) => console.log('listening'));