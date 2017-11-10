const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//const is a ES6 feature
const app = express();

//Map global promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://amquinte:test@ds153015.mlab.com:53015/vidjot', {
    useMongoClient: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add a details'});
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }

    else{
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(Idea => {
                res.redirect('/ideas');
            })
    }
});

const port = 5500;



//Index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});

//Idea route
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
          ideas: ideas
        });
    });
});

//Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Using arror function notation =>
app.listen(port, () => {
    console.log(`Started server on ${port}`) //Use backticks ` for template literals ${var}
});