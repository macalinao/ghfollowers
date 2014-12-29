var user = require('../lib/user');

var userRepo = process.argv[2].split('/');
if (!userRepo || userRepo.length !== 2) {
  console.error('Usage: node scripts/star <user>/<repo>');
  process.exit(1);
}

user.fromLogin(star).then(function(user) {
  return [user, user.star(userRepo[0], userRepo[1])];
}).spread(function(user, res) {
  console.log('Added', res.stars, 'stars to', userRepo[0] + '/' + userRepo[1]);
  process.exit(0);
});
