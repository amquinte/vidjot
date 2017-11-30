//import { error } from 'util';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User login route
router.get('/login', (req, res) => {
    res.render('users/login');
})

// User register route
router.get('/register', (req, res) => {
    res.render('users/register');
})

// Register form POST
router.post('/register', (req, res) => {
    //Needed for backend password validation
    let errors = [];
    //Checks if passwords match
    if(req.body.password != req.body.password2){
        errors.push({text: 'Passwords do not match'});
    }

    //Password must be at least 4 character long
    if(req.body.password.length < 4){
        errors.push({text: 'Password must be at least 4 characters long'});
    }

    //Re-render form if there were any previous errors
    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }

    else{
        res.send('Passed');
    }

})

module.exports = router;