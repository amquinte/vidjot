const express = require('express'); //For server
const exphbs = require('express-handlebars'); //For templates
const mongoose = require('mongoose'); //For MongoDB
const bodyParser = require('body-parser'); //To parse form data
const methodOverride = require('method-override'); //To override form methods
const flash = require('connect-flash'); //For flash messages
const session = require('express-session');

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

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

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
                req.flash('success_msg', 'New idea added');
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

//Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

//Edit form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Video idea update');
                res.redirect('/ideas');
            })
    });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    })
})

//Using arror function notation =>
app.listen(port, () => {
    console.log(`Started server on ${port}`) //Use backticks ` for template literals ${var}
});