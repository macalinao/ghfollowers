var P = require('bluebird');
var async = require('async');
var checkPrivilege = require('./privilege_check');
var newGithub = require('./new_github');
var users = require('./db').get('users');
P.promisifyAll(users);

/**
 * Gets all of the users that the user hasn't been followed by.
 */
function findNotFollowedBy(gh, dbuser) {
  // Get followers of user
  var followedBy = dbuser.followedBy || [];

  // Find users where their login isn't one of those followedBy
  return users.findAsync({
    login: {
      $nin: followedBy
    }
  }).then(function(dbNotFollowing) {
    return new P(function(resolve, reject) {
      if (!dbNotFollowing) return;

      // These are the users that are not following in the DB.
      var notFollowing = [];
      async.each(dbNotFollowing, function(userObj, done) {
        if (gh.login === userObj.login) return done(); // Skip if same user

        var ugh = newGithub(userObj.token);
        var getFollowUser = P.promisify(ugh.user.getFollowUser, ugh.user);
        getFollowUser({
          user: gh.login
        }).then(function(res) {
          done();
        }, function() {
          notFollowing.push(userObj.login);
          done();
        });

      }, function(err) {
        if (err) return reject(err);
        resolve(notFollowing);
      });
    });
  });
}

function getUser(login) {
  return checkPrivilege(login).then(function(privilege) {

    return users.findOneAsync({
      login: login
    }).then(function(user) {

      var gh = newGithub(user.token);
      gh.login = user.login;

      users.findAsync({
        followedBy: login
      }).then(function(following) {

        findNotFollowedBy(gh, user).then(function(notFollowedBy) {

          var followerCt = user.followedBy ? user.followedBy.length : 0;
          var remaining = privilege.count - followerCt;
          var amount = Math.min(notFollowedBy.length, remaining);
          if (amount < 0) amount = 0;

          return {
            privilege: privilege,
            following: following,
            amount: amount,
            remaining: remaining,
            followerCt: followerCt,
            user: user
          };

        });
      });
    });
  });
}

module.exports = getUser;
