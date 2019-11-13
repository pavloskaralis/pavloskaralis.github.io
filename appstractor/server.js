const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const data = [];

app.set('view engine', 'jsx');
app.engine('jsx',require('express-react-views').createEngine());


app.use(express.static('public'));

app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//GET
app.get('/appstractor', (req,res) => {
    res.render('index.ejs');
});

app.get('/appstractor/render', (req,res) => {
    res.render('render.ejs');
});

app.get('/appstractor/gallery', (req,res) => {
    res.render('gallery.ejs');
});

app.get('/appstractor/canvas', (req,res) => {
    res.render('canvas.ejs');
});

//PUT
app.put('/appstractor/gallery/new', (req, res) => {
    data.push(req.body.html);
    console.log(data);
});

//Listen
app.listen(port, (req,res) => console.log('listening'));