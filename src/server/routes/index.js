var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Passport Practice' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate
  ('local', {successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true}));

router.get('/logout', function(req, res, next) {
  res.redirect('/');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var passConf = req.body.passwordConfirm;

  if (password === passConf) {
    knex('users').insert({email: email, password: password})
      .then(function() {
        res.redirect('/login');
      });
  } else {
    res.render('login');
  }
});

module.exports = router;
