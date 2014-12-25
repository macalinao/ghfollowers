var user = require('../lib/user');

var follow = process.argv[2];

user.fromLogin(follow).then(function(user) {
  return [user, user.addFollowers(-1)];
}).spread(function(user, res) {
  console.log('Added', res.follows, 'followers to', user.login);
  process.exit(0);
});
