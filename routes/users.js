//import { error } from 'util';

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load user model
require('../models/User');
const User = mongoose.model('users');

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

        //Checks if email has already been registered
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('error_msg', 'Email already registered');
                    res.render('users/register', {
                        errors: errors,
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        password2: req.body.password2
                    });
                }

                //Creates new user for mongoDB database
                else{
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
            
                    //Encrypt password being sent
                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if(err) throw err;
                            newUser.password = hash; //Changes password value to newly hashed password
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login'); //Redirects to login page after succesfully creating new user
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            })
    }

})

module.exports = router;