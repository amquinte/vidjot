const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        //Looks up user within db
        User.findOne({
            email: email
        }).then(user => {
            //If user is not found in db
            if(!user){
                return done(null, false, {message: 'No User Found'});
            }

            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }

                else{
                    return done(null, false, {message: 'Password Incorrect'});
                }
            })
        })
    }));

    //Serialize and deserialize to create sessions when login
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user);
      });
    });
}