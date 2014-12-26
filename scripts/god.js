var P = require('bluebird');
var user = require('../lib/user');
var users = require('../lib/db').get('users');
P.promisifyAll(users);

var follow = process.argv[2];
if (!follow) {
  console.error('Usage: node scripts/god <username>');
  process.exit(1);
}

user.fromLogin(follow).then(function(user) {
  return [user, users.updateAsync({
    login: user.login
  }, {
    $set: {
      god: true
    }
  })];
}).spread(function(user) {
  console.log('Made', user.login, 'a god');
  process.exit(0);
});
