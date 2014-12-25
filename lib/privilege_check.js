var P = require('bluebird');
var config = require('../config');
var users = require('./db').get('users');
P.promisifyAll(users);

/**
 * Checks the amount of followers a user is allowed to have.
 *
 * @param login The login of the user (username)
 * @param cb(err, privilege)
 */
function checkPrivilege(login, cb) {
  var count = config.baseFollowers;
  return users.countAsync({
    ref: login
  }).then(function(ct) {
    count += ct * config.referralBonus;
    return {
      count: count,
      referrals: ct
    };
  });
}

module.exports = checkPrivilege;
