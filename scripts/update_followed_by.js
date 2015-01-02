var user = require('../lib/user');

var login = process.argv[2];
if (!login) {
  console.error('Usage: node scripts/update_followed_by <username>');
  process.exit(1);
}

user.fromLogin(login).then(function(user) {
  return [user, user.updateFollowedBy()];
}).spread(function(user, res) {
  console.log('Removed', res.length, 'invalid followers from', user.login);
  process.exit(0);
});
