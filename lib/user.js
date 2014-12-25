var async = require('async');
var checkPrivilege = require('./privilege_check');
var newGithub = require('./new_github');
var users = require('./db').get('users');

/**
 * Gets all of the users that the user hasn't been followed by.
 */
function findNotFollowedBy(gh, dbuser, cb) {
  // Get followers of user
  var followedBy = dbuser.followedBy || [];

  // Find users where their login isn't one of those followedBy
  users.find({
    login: {
      $nin: followedBy
    }
  }, function(err, dbNotFollowing) {
    if (!dbNotFollowing) return cb(err, []);

    // These are the users that are not following in the DB.
    var notFollowing = [];
    async.eachSeries(dbNotFollowing, function(userObj, done) {
      if (gh.login === userObj.login) return done(); // Skip if same user

      var ugh = newGithub(userObj.token);
      ugh.user.getFollowUser({
        user: gh.login
      }, function(notF, res) {
        if (notF) {
          notFollowing.push(userObj.login);
        }
        done();
      });
    }, function(err) {
      cb(err, notFollowing);
    });
  });
}

function getUser(login, cb) {
  checkPrivilege(login).then(function(privilege) {

    users.findOne({
      login: login
    }, function(error, user) {
      var gh = newGithub(user.token);
      gh.login = user.login;

      users.find({
        followedBy: login
      }, function(err, following) {

        findNotFollowedBy(gh, user, function(err, notFollowedBy) {

          var followerCt = user.followedBy ? user.followedBy.length : 0;
          var remaining = privilege.count - followerCt;
          var amount = Math.min(notFollowedBy.length, remaining);
          if (amount < 0) amount = 0;

          cb(null, {
            privilege: privilege,
            following: following,
            amount: amount,
            remaining: remaining,
            followerCt: followerCt,
            user: user
          });

        });
      });
    });
  });
}

module.exports = getUser;
