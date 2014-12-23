var addFollowers = require('./follow');
var checkAuth = require('./check_auth');
var checkPrivilege = require('./privilege_check');
var githubOAuth = require('./github_oauth');
var users = require('./db').get('users');

module.exports = function(app) {

  app.get('/me', checkAuth, function(req, res) {
    checkPrivilege(req.session.user.login, function(err, privilege) {
      users.find({
        following: req.session.user.login
      }, function(err, following) {
        res.json({
          privilege: privilege,
          following: following
        });
      });
    });
  });

  app.get('/user', checkAuth, function(req, res) {
    return res.json(req.session.user);
  });

  app.post('/follow/:login', checkAuth, function(req, res) {
    checkPrivilege(req.session.user.login, function(err, privilege) {
      users.findOne({
        login: req.session.user.login
      }, function(error, user) {
        var amount = privilege.count;
        if (user.following) {
          amount -= user.following.length;
        }
        addFollowers(req.session.user.login, amount, function(err, result) {
          res.json(result);
        });
      });
    });
  });

  githubOAuth.addRoutes(app, function(err, token, res, ignore, req) {
    if (token.error) {
      return res.send('There was an error logging in: ' + token.error_description);
    }
    req.session.token = token.access_token;
    res.redirect('/');
  });

};
