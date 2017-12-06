const express = require('express'); //For server
const path = require("path");
const exphbs = require('express-handlebars'); //For templates
const mongoose = require('mongoose'); //For MongoDB
const bodyParser = require('body-parser'); //To parse form data
const methodOverride = require('method-override'); //To override form methods
const flash = require('connect-flash'); //For flash messages
const session = require('express-session');
const passport = require('passport');

//const is a ES6 feature
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Map global promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Sets the public folder as the express static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


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

//process.env.PORT is necessary for Heroku
const port = process.env.PORT || 5500;

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

//Using arror function notation =>
app.listen(port, () => {
    console.log(`Started server on ${port}`) //Use backticks ` for template literals ${var}
});