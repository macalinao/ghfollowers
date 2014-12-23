var addFollowers = require('./follow');

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

};
