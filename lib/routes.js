var checkAuth = require('./check_auth');
var user = require('./user');
var githubOAuth = require('./github_oauth');

module.exports = function(app) {

  app.get('/me', checkAuth, function(req, res) {
    user.fromLogin(req.session.user.login).then(function(user) {
      return user.summary();
    }).then(function(summary) {
      res.json(summary);
    });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/user', checkAuth, function(req, res) {
    return res.json(req.session.user);
  });

  app.post('/follow/:login', checkAuth, function(req, res) {
    user.fromLogin(req.params.login).then(function(user) {
      return [user, user.summary()];
    }).spread(function(user, summary) {
      return user.addFollowers(summary.amount);
    }).then(function(result) {
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

};
