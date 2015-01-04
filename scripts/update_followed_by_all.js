var user = require('../lib/user');
var users = require('../lib/db').get('users');
var P = require('bluebird');
P.promisifyAll(users);

users.findAsync({}).map(function(model) {
  return user.fromModel(model).updateFollowedBy().then(function(res) {
    console.log('Removed', res.length, 'invalid followers from', model.login);
    return [model.login, res.length];
  }).catch(TypeError, function(err) {
    // TODO fix this later
  });
}).then(function(done) {
  process.exit(0);
});
