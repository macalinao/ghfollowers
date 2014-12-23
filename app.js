var _ = require('lodash');
var express = require('express');
var db = require('./lib/db');
var users = db.get('users');
var session = require('express-session');

var githubOAuth = require('./lib/github_oauth');
var app = express();
var newGithub = require('./lib/new_github');
var addFollowers = require('./lib/follow');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Get GitHub user
app.use(function(req, res, next) {
  if (req.session.token) {
    var github = req.github = newGithub(req.session.token);
    if (!req.session.user) {
      return github.user.get({}, function(err, user) {
        req.session.user = user;

        users.findOne({
          login: user.login
        }, function(err, doc) {
          if (doc) {
            return users.updateById(doc._id, {
              login: doc.login,
              token: req.session.token
            }, next);
          }

          // Insert user to database
          users.insert({
            login: user.login,
            token: req.session.token
          }, next);

        });
      });
    }
    return next();
  }
  next();
});

app.use(express.static('dist/'));

app.get('/user', function(req, res) {
  if (!req.session.user) {
    return res.status(401).json({
      error: 'Not logged in'
    });
  }
  return res.json(req.session.user);
});

app.post('/follow/:login', function(req, res) {
  if (!req.session.user) {
    return res.status(401).json({
      error: 'Not logged in'
    });
  }
  addFollowers(req.session.user.login, -1, function(err, result) {
    res.json(result);
  });
});

githubOAuth.addRoutes(app, function(err, token, res, ignore, req) {
  if (token.error) {
    return res.send('There was an error logging in: ' + token.error_description);
  }

  req.session.token = token.access_token;
  res.redirect('/');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
