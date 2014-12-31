var P = require('bluebird');
var user = require('../lib/user');
var users = require('../lib/db').get('users');
P.promisifyAll(users);

var validates = 0;

users.findAsync({}).then(function(users) {
  return users.map(function(u) {
    var uzer = user.fromModel(u);
    return uzer.summary().then(function(summary) {
      return [u.login, uzer.addFollowers(summary.amount)];
    });
  });
}).map(function(result) {
  console.log(result[0], result[1].follows);
}).then(function() {
  process.exit(0);
});
