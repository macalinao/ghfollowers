var async = require('async');
var db = require('./db');
var users = db.get('users');
var newGithub = require('./new_github');

/**
 * Check if a user is following another user.
 *
 * @param user a GH API instance
 * @param other The other user
 */
function isFollowing(user, other, cb) {
  user.user.getFollowUser({
    user: other
  }, function(err, res) {
    var ret = res.meta.status.indexOf('204') === 0; // Weird API
    cb(err, ret);
  });
}

/**
 * Make the first user follow the second.
 *
 * @param user GH API instance
 * @param other String login username
 */
function follow(user, other, cb) {
  isFollowing(user, other, function(err, following) {

    // If following, return false
    if (following) {
      return cb(null, false);
    }

    // Follow the user
    user.user.followUser({
      user: other
    }, function(followErr, followRes) {
      if (followErr) return cb(followErr, false);
      return cb(null, true);
    });

  });
}

/**
 * Make a user unfollow someone. Both params must be GH API instances.
 *
 * @param user GH API instance
 * @param other String login username
 */
function unfollow(user, other, cb) {
  isFollowing(user, other, function(err, following) {
    // If following, return false
    if (!following) {
      return cb(null, false);
    }

    // Unollow the user
    user.user.unfollowUser({
      user: other
    }, function(unfollowErr, unfollowRes) {
      if (unfollowErr) return cb(unfollowErr, false);
      return cb(null, true);
    });

  });
}


/**
 * Adds an amount of followers to a user.
 *
 * @param amount - Use '-1' to add as many as possible.
 */
function addFollowers(login, amount, cb) {

  users.findOne({
    login: login
  }, function(err, user) {
    // CB null if user wasn't found
    if (!user) {
      return cb(null, null);
    }

    var gh = newGithub(user.token);
    var sum = 0;

    users.find({}, function(err, docs) {

      async.eachSeries(docs, function(other, fin) {
        var ugh = newGithub(other.token);

        // Ignore if same as user
        if (other.login === user.login) return fin();

        // Follow each other
        async.waterfall([
          function(done) {
            follow(gh, other.login, done);
          },
          function(res, done) {
            // Terminate if they didn't follow
            if (!res) return done();

            follow(ugh, user.login, function(err, didFollow) {
              if (!didFollow) {
                return unfollow(gh, other.login, done);
              }
              done();
            });
          }
        ], function(err) {
          fin();
        });

      }, function() {
        cb(null, {
          follows: sum
        });
      });
    });

  });

};

module.exports = addFollowers;
