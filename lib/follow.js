var P = require('bluebird');
var async = require('async');
var db = require('./db');
var users = db.get('users');
P.promisifyAll(users);
var newGithub = require('./new_github');

/**
 * Check if a user is following another user.
 *
 * @param user a GH API instance
 * @param other The other user
 */
function isFollowing(user, other) {
  var getFollowUser = P.promisify(user.user.getFollowUser, user.user);
  return new P(function(resolve) {
    getFollowUser({
      user: other
    }).then(function(res) {
      return resolve(null, true);
    }, function(res) {
      return resolve(null, false);
    });
  });
}

/**
 * Make the first user follow the second.
 *
 * @param user GH API instance
 * @param other String login username
 */
function follow(user, other) {
  return isFollowing(user, other).then(function(following) {
    if (following) return false;

    var followUser = P.promisify(user.user.followUser, user.user);
    return followUser({
      user: other
    });
  });
}

/**
 * Follow with database updates
 *
 * @param user GH API instance
 * @param other String login username
 */
function followWithDb(user, other) {
  return follow(user, other).then(function(res) {
    if (!res) return false;
    return users.updateAsync({
      login: other
    }, {
      $addToSet: {
        followedBy: user.login
      }
    });
  });
}

/**
 * Make a user unfollow someone. Both params must be GH API instances.
 *
 * @param user GH API instance
 * @param other String login username
 */
function unfollow(user, other) {
  return isFollowing(user, other).then(function(following) {
    if (!following) return false;

    var unfollowUser = P.promisify(user.user.unFollowUser, user.user);
    return unfollowUser({
      user: other
    });
  });
}

/**
 * Unfollow with database updates
 *
 * @param user GH API instance
 * @param other String login username
 */
function unfollowWithDb(user, other) {
  return unfollow(user, other).then(function(res) {
    if (!res) return false;
    return users.updateAsync({
      login: other
    }, {
      $pull: {
        followedBy: user.login
      }
    });
  });
}


/**
 * Adds an amount of followers to a user.
 *
 * @param amount - Use '-1' to add as many as possible. It will add as many followers as possible.
 */
function addFollowers(login, amount) {
  return users.findOneAsync({
      login: login
    })
    .then(function(user) {
      if (!user) return;
      gh = newGithub(user.token);
      gh.login = user.login;

      return users.findAsync({}).then(function(docs) {

        return new P(function(resolve) {
          var sum = 0;
          async.eachSeries(docs, function(other, done) {
            // Ignore if same as user
            if (amount !== -1 && sum >= amount || other.login === user.login) return done();

            // Otherwise follow
            var ugh = newGithub(other.token);
            ugh.login = other.login;
            return followWithDb(ugh, gh.login).then(function(res) {
              if (res) sum++;
              done();
            });

          }, function() {
            resolve(null, sum);
          });
        });


      }).then(function(sum) {
        return {
          follows: sum,
          amount: amount
        };
      });

    });

};

module.exports = addFollowers;
