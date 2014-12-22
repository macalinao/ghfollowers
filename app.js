var _ = require('lodash');
var express = require('express');
var session = require('express-session');

var GitHubApi = require('github');
var githubOAuth = require('github-oauth')({
  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  baseURL: (process.env.NODE_ENV === 'production') ? 'http://www.githubfollowers.com' : 'http://localhost:3000',
  loginURI: '/login',
  callbackURI: '/oauth_callback',
  scope: 'user:follow'
});

var app = express();

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
        next();
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

githubOAuth.addRoutes(app, function(err, token, res, ignore, req) {
  if (token.error) {
    return res.send('There was an error logging in: ' + token.error_description);
  }

  req.session.token = token.access_token;
  res.redirect('/');
});

function newGithub(token) {
  var api = new GitHubApi({
    version: '3.0.0'
  });
  api.authenticate({
    type: 'oauth',
    token: token
  });
  return api;
}

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
