var addFollowers = require('./follow');
var checkAuth = require('./check_auth');
var getUser = require('./user');
var githubOAuth = require('./github_oauth');

module.exports = function(app) {

  app.get('/me', checkAuth, function(req, res) {
    getUser(req.session.user.login).then(function(data) {
      res.json(data);
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
    getUser(req.params.login).then(function(data) {
      addFollowers(req.params.login, data.amount).then(function(result) {
        res.json(result);
      }, function(err) {
        console.error(err);
        res.json({
          error: 'Error when adding followers!'
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
