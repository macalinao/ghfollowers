var newGithub = require('./new_github');
var users = require('./db').get('users');

module.exports = function(req, res, next) {
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
          var newUser = {
            login: user.login,
            token: req.session.token
          };
          if (req.session.ref) {
            newUser.ref = req.session.ref;
          }
          users.insert(newUser, next);

        });
      });
    }
    return next();
  }
  next();
}
