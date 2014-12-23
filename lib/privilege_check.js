var config = require('../config');
var users = require('./db').get('users');

/**
 * Checks the amount of followers a user is allowed to have.
 *
 * @param login The login of the user (username)
 * @param cb(err, privilege)
 */
function checkPrivilege(login, cb) {
  var count = config.baseFollowers;
  users.count({
    ref: login
  }, function(err, ct) {
    count += ct * config.referralBonus;
    cb(err, {
      count: count,
      referrals: ct
    });
  });
};

module.exports = checkPrivilege;
