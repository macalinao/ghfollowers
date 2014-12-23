var addFollowers = require('./follow');
var githubOAuth = require('./github_oauth');

module.exports = function(app) {

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

};
