const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//Load User Model
require('../models/User');
const User = mongoose.model('users');

//Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//Login Form Post
router.post('/login', (req, res, next) => {
    console.log("logged");
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Register Form Post
router.post('/register', (req, res) =>{
    const errors = [];
    
    User.findOne({email: req.body.email}).then((user) => {
        if(user) {
            errors.push({text: "Email already registered"});
        } else {
            if(req.body.password !== req.body.password2) {
                errors.push({text: "Password do not match"});
            }
            if(req.body.password.length < 6) {
                errors.push({text: "Password must be at least 6 characters"});
            }
        }
        if(errors.length > 0) {
            res.render('users/register', {
                errors, 
                name: req.body.name, 
                email: req.body.email,
                password: req.body.password,
                password2: req.body.password2
            });
        } else {
            
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
    
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save().then((user) => {
                        req.flash('success_msg', "Registration Successfull");
                        res.redirect('/users/login');
                    }).catch((err) => {
                        console.log(err);
                        return;
                    });
                });
            });
        }
    });
});

//Logout User
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "You are now logged out.");
    res.redirect('/users/login');
});

module.exports = router;