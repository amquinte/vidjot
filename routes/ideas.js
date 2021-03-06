const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Process form
router.post('/', (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add a details'});
    }

    if(errors.length > 0){
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }

    else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(Idea => {
                req.flash('success_msg', 'New idea added');
                res.redirect('/ideas');
            })
    }
});

//Idea route
//Loads all the ideas for logged in user
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id}) //This ensures that logged in user can only see their ideas
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
          ideas: ideas
        });
    });
});

//Add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit', {
                idea:idea
            });
        }
    });
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    })
})

module.exports = router;