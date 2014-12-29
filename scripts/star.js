var user = require('../lib/user');

var userRepo = process.argv[2].split('/');
if (!userRepo || userRepo.length !== 2) {
  console.error('Usage: node scripts/follow <user>/<repo>');
  process.exit(1);
}

user.fromLogin(follow).then(function(user) {
  return [user, user.star(userRepo[0], userRepo[1])];
}).spread(function(user, res) {
  console.log('Added', res.follows, 'stars to', userRepo[0] + '/' + userRepo[1]);
  process.exit(0);
});
