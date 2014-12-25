var P = require('bluebird');
var user = require('./user');
var newGithub = require('./new_github');
var users = require('./db').get('users');
P.promisifyAll(users);

module.exports = function(req, res, next) {
  if (!req.session.token) return next();
  var github = req.github = newGithub(req.session.token);

  var userPromise;
  if (!req.session.login) {
    userPromise = user.fromToken(req.session.token).then(function(user) {
      req.session.login = user.login;
      // Star on login!
      return [user, user.star('simplyianm', 'githubfollowers')];
    }).spread(function(user) {
      return user;
    });
  } else {
    userPromise = user.fromLogin(req.session.login);
  }

  userPromise.then(function(user) {
    req.user = user;
    next();
  }, next);
};
