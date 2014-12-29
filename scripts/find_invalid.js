var P = require('bluebird');
var user = require('../lib/user');
var users = require('../lib/db').get('users');
P.promisifyAll(users);

var validates = 0;

users.findAsync({}).then(function(users) {
  return users.map(function(u) {
    return user.fromModel(u).validate().then(function(res) {
      return [u.login, res];
    });
  });
}).map(function(user) {
  if (!user[1]) console.log(user[0]);
}).then(function() {
  process.exit(0);
});
