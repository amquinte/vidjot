const express = require('express');
const exphbs = require('express-handlebars');

//const is a ES6 feature
const app = express();
const port = 5500;

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Index route
app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
})

//Using arror function notation =>
app.listen(port, () => {
    console.log(`Started server on ${port}`) //Use backticks ` for template literals ${var}
});