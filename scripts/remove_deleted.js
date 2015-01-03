var P = require('bluebird');
var user = require('../lib/user');
var users = require('../lib/db').get('users');
P.promisifyAll(users);

var removed = [];

users.findAsync({}).then(function(users) {
  return users.map(function(u) {
    return user.fromModel(u).validate().then(function(res) {
      return [u.login, res];
    });
  });
}).map(function(user) {
  if (!user[1]) {
    removed.push(user[0]);
    return users.removeAsync({
      login: user[0]
    });
  }
}).then(function() {
  console.log('Removed', removed.length, 'deleted users');
  process.exit(0);
});
