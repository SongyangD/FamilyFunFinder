const express = require('express');
// const { register } = require('../models/user');
const router = express.Router();
const passport = require('passport'); 
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo:true }), users.login);
    // need the keepSessionInfo:true keep the returnTo in the session

router.get("/logout", users.logout);

module.exports = router;