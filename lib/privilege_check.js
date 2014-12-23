var users = require('./db').get('users');

/**
 * Checks the amount of followers a user is allowed to have.
 *
 * @param login The login of the user (username)
 * @param cb(err, amount)
 */
function checkPrivilege(login, cb) {
  users.find({
    referrer: login
  }, function(err, user) {});
};
