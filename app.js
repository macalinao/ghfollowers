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

// Prerender for SEO
app.use(require('prerender-node'));

// Middleware to add GH user to request object
app.use(require('./lib/github_user_middleware'));

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
