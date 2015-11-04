import P from 'bluebird';
import _ from 'lodash';

import async from 'async';
import GitHubApi from 'github';
import request from 'superagent-bluebird-promise';

import config from '../config';
import db from './db';

const users = db.get('users');
P.promisifyAll(users);

function newGithub(token) {
  var api = new GitHubApi({
    version: '3.0.0'
  });
  api.authenticate({
    type: 'oauth',
    token: token
  });
  return api;
};

export default class User {

  constructor(login, github, model) {
    this.login = login;
    this.github = github;
    this.model = model;
  }

  /**
   * Checks if the user is following the given username.
   */
  async isFollowing(other) {
    const getFollowUser = P.promisify(this.github.user.getFollowUser, this.github);
    try {
      await getFollowUser({
        user: other
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Follow a user.
   *
   * @param other String login username
   */
  async follow(other) {
    const following = await this.isFollowing(other);
    if (following) return false;

    const followUser = P.promisify(this.github.user.followUser, this.github.user);
    const res = await followUser({ user: other });

    if (!res) return false;
    return users.updateAsync({
      login: other
    }, {
      $addToSet: {
        followedBy: this.login
      }
    });
  }

  /**
   * Make a user unfollow someone. Both params must be GH API instances.
   *
   * @param user GH API instance
   * @param other String login username
   */
  async unfollow(other) {
    const following = await this.isFollowing(other);
    if (!following) return false;

    const unfollowUser = P.promisify(this.github.user.unFollowUser, this.github.user);
    const res = await unfollowUser({
      user: other
    });

    return users.updateAsync({
      login: other
    }, {
      $pull: {
        followedBy: this.login
      }
    });
  }

  /**
   * Stars a repo.
   */
  async star(user, repo) {
    const doStar = P.promisify(this.github.repos.star, this.github.repos);
    return doStar({
      user: user,
      repo: repo
    });
  }

  /**
   * Adds an amount of followers to a user.
   *
   * @param amount - Use '-1' to add as many as possible. It will add as many followers as possible.
   */
  async addFollowers(amount) {

    const docs = _.shuffle(await users.findAsync({
      login: {
        $ne: this.login
      }
    }));

    let sum = 0;

    await P.map(docs, async function(doc) {
      // Ignore if same as user
      if (amount !== -1 && sum >= amount) return done();
      // Otherwise follow
      let otherUser = User.fromModel(otherModel);
      try {
        let res = await otherUser.follow(thiz.login);
        if (res) sum++;
      } catch (e) {
        // OAuth token no longer valid
        await this.invalidate();
      }
    });

    return {
      follows: sum,
      amount: amount
    };

  }

  /**
   * Removes all of a user's followers.
   */
  async removeFollowers() {
    const { login } = this;

    const results = await P.settle((this.model.followedBy || []).map(async function(user) {
      let unfollower = await User.fromLogin(user);
      return unfollower.unfollow(login);
    }));

    const unfollowed = results.filter(function(r) {
      return r.isFulfilled();
    }).length;
    const invalid = results.filter(function(r) {
      return r.isRejected();
    }).length;

    return {
      unfollowed: unfollowed,
      invalid: invalid
    };
  }

  /**
   * Checks the amount of followers this user is supposed to have.
   * @param login The login of the user (username)
   * @param cb(err, privilege)
   */
  async checkPrivilege() {
    let count;
    if (this.model.god) {
      count = -1;
    } else {
      let referredCount = await users.countAsync({
        ref: this.login
      });
      count = config.baseFollowers + referredCount * config.referralBonus;
    }

    return {
      count: count,
      referrals: ct
    };

  }

  /**
   * Gets all of the users that the user hasn't been followed by.
   * This is a pretty expensive operation as it makes a lot of GH api requests.
   */
  async findNotFollowedBy() {
    // Get followers of user
    const followedBy = this.model.followedBy || [];

    // Find users where their login isn't one of those followedBy
    const dbNotFollowing = await users.findAsync({
      login: {
        $nin: followedBy,
        $ne: this.login
      }
    });

    if (!dbNotFollowing) return [];

    // These are the users that are not following in the DB.
    const notFollowing = [];
    await P.map(dbNotFollowing, async (userObj) => {
      let other = User.fromModel(userObj);
      let res = await other.isFollowing(this.login);
      if (!res) {
        notFollowing.push(other.login);
      }
    });

    return notFollowing;
  }

  /**
   * Get users that this user is following
   */
  async getFollowing() {
    return users.findAsync({
      followedBy: this.login
    });
  }

  /**
   * Gets the models of this user's followers.
   */
  async followers() {
    if (!this.model.followedBy) {
      return [];
    }

    return users.findAsync({
      login: {
        $in: this.model.followedBy
      }
    });
  }

  /**
   * Returns a summary of a user
   */
  async summary() {
    const { privilege, notFollowedBy } = await P.props({
      privilege: this.checkPrivilege(),
      notFollowedBy: this.findNotFollowedBy()
    });

    const followerCt = this.model.followedBy ? this.model.followedBy.length : 0;
    const remaining = (privilege.count === -1) ? 99999999 : (privilege.count - followerCt);
    const amount = Math.max(Math.min(notFollowedBy.length, remaining), 0);

    return {
      privilege: privilege,
      amount: amount,
      remaining: remaining,
      followerCt: followerCt,
      user: this.model
    };
  }

  /**
   * Updates this user's followers in the database.
   */
  async updateFollowedBy() {
    var me = this.login;
    var remove = [];

    if (!this.model.followedBy) {
      return;
    }

    await P.map(this.model.followedBy, async function(login) {
      let user = await User.fromLogin(login);
      if (!user) {
        return remove.push(login);
        throw 'done';
      }

      if (!(await user.isFollowing(me))) {
        return remove.push(user.login);
      }

      let valid = await user.validate();
      if (!valid) {
        remove.push(user.login);
      }
    });

    await users.updateAsync({
      login: me
    }, {
      $pullAll: {
        followedBy: remove
      }
    });

    return remove;
  }

  /**
   * Checks if a user's oauth token is valid.
   */
  async validate() {
    const get = P.promisify(this.github.user.get, this.github.user);

    try {
      const result = await get({});
      const res = await request.get('https://github.com/' + user.login).promise();
      return !res.notFound;
    } catch (e) {
      return false;
    }

  }

  /**
   * Invalidates this user by removing their followers and deleting them from the database.
   */
  async invalidate() {
    await P.map(await this.getFollowing(), function(model) {
      return User.fromModel(model).updateFollowedBy();
    });

    await this.removeFollowers();
    return this.remove();
  }

  async remove() {
    return users.removeAsync({
      login: this.login
    });
  }

  /**
   * Makes a user object from their login. Assumes it's already in the db.
   */
  static async fromLogin(login) {
    const model = await users.findOneAsync({
      login: login
    });

    if (!model) return null;
    return this.fromModel(model);
  }

  /**
   * Makes a (possibly new) user object from their token.
   */
  static async fromToken(token, ref) {
    const github = newGithub(token);
    const get = P.promisify(github.user.get, github.user);
    const gh = await get({});
    const model = await users.findOneAsync({
      login: result.login
    });

    let login;
    if (model) {
      login = model.login;
      await users.updateByIdAsync(model._id, {
        $set: {
          token: token
        }
      });
    } else {
      login = gh.login;
      var insert = {
        login: gh.login,
        token: token,
        avatar: gh.avatar_url
      };
      if (ref) {
        insert.ref = ref;
      }
      await users.insertAsync(insert);
    }

    return this.fromLogin(login);
  }

  /**
   * Makes a user object from their DB model. Does not return a promise.
   */
  static fromModel(model) {
    return new User(model.login, newGithub(model.token), model);
  }

}
