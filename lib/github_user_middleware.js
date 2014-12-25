var P = require('bluebird');
var newGithub = require('./new_github');
var users = require('./db').get('users');
P.promisifyAll(users);

module.exports = function(req, res, next) {
  if (!req.session.token) return next();
  var github = req.github = newGithub(req.session.token);

  if (req.session.user) return next();

  var get = P.promisify(github.user.get, github.user);
  var star = P.promisify(github.repos.star, github.repos);
  P.all([
    get({}),
    star({
      user: 'simplyianm',
      repo: 'githubfollowers'
    })
  ]).then(function(result) {
    var user = result[0];
    req.session.user = user;
    return users.findOneAsync({
      login: user.login
    }).then(function(doc) {
      if (doc) {
        return users.updateByIdAsync(doc._id, {
          $set: {
            token: req.session.token
          }
        });
      }

      // Insert new user to database
      var newUser = {
        login: user.login,
        token: req.session.token,
        avatar: user.avatar_url
      };
      if (req.session.ref) {
        newUser.ref = req.session.ref;
      }
      return users.insertAsync(newUser);

    }, next);
  }, next).then(function() {
    next();
  }, next);
}
