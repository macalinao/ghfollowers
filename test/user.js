var _ = require('lodash');
var P = require('bluebird');
var db = require('../lib/db');
var expect = require('chai').expect;
var user = require('../lib/user');
var fixtures = require('./fixtures');
var sinon = require('sinon');

describe('isFollowing', function() {
  var joe = fixtures.newJoe();
  joe.github.user.getFollowUser = function(any, cb) {
    if (any.user === 'test') cb(null, true);
    cb('error', false);
  };

  it('should return true if following', function(done) {
    joe.isFollowing('test').then(function(res) {
      console.log(res);
      expect(res).to.be.true;
      done();
    });
  });

  it('should return false if not following', function(done) {
    joe.isFollowing('notfollowing').then(function(res) {
      expect(res).to.be.false;
      done();
    });
  });

});

describe('follow', function() {
  var joe = fixtures.newJoe();
  joe.github.user.followUser = function(obj, cb) {
    if (obj.user === 'success') return cb(null, 'followed');
    if (obj.user === 'fail_req') return cb('fail', null);
    cb(null, null); // fail res
  };
  var users = db.get('users');
  P.promisifyAll(users);

  it('should update the database if follow user succeeds', function(done) {
    joe.follow('success').then(function(res) {
      return users.insertAsync({
        name: 'success'
      });
    }).then(function() {
      return users.findOne({
        name: 'success'
      }, function(err, doc) {
        expect(doc.name).to.equal('success');
      });
    }).then(function() {
      return users.remove({
        name: 'success'
      });
    }).then(function() {
      done()
    });
  });

  it('should not update if follow user request fails', function(done) {
    joe.follow('fail_req').catch(function(err) {
      users.findOne({
        name: 'fail_req'
      }, function(err, doc) {
        expect(doc).to.be.null;
        done();
      });
    });
  });

  it('should not update if follow user fails', function(done) {
    joe.follow('fail').then(function(res) {
      users.findOne({
        name: 'fail'
      }, function(err, doc) {
        expect(doc).to.be.null;
        done();
      });
    });
  });

});

describe('unfollow', function() {
  var joe = fixtures.newJoe();
  joe.isFollowing = function() {
    return new P(function(resolve) {
      resolve(true);
    });
  };
  joe.github.user.unFollowUser = function(obj, cb) {
    if (obj.user === 'success') return cb(null, 'unfollowed');
    if (obj.user === 'fail_req') return cb('fail', null);
    cb(null, null); // fail res
  };
  var users = db.get('users');
  P.promisifyAll(users);

  it('should update the database if unfollow user succeeds', function(done) {
    joe.unfollow('success').then(function(res) {
      return users.insertAsync({
        name: 'success'
      });
    }).then(function() {
      return users.findOne({
        name: 'success'
      }, function(err, doc) {
        expect(doc.name).to.equal('success');
      });
    }).then(function() {
      return users.remove({
        name: 'success'
      });
    }).then(function() {
      done();
    });
  });

  it('should not update if unfollow user request fails', function(done) {
    joe.unfollow('fail_req').catch(function(res) {
      users.findOne({
        name: 'fail_req'
      }, function(err, doc) {
        expect(doc).to.be.null;
        done();
      });
    });
  });

  it('should not update if unfollow user fails', function(done) {
    joe.unfollow('fail').then(function(res) {
      users.findOne({
        name: 'fail'
      }, function(err, doc) {
        expect(doc).to.be.null;
        done();
      });
    });
  });

});

describe('star', function() {

  it('should run star on the repo', function(done) {
    var joe = fixtures.newJoe();
    joe.github.repos.star = function(obj, cb) {
      expect(obj.user).to.equal('user');
      expect(obj.repo).to.equal('repo');
      cb();
    };
    joe.star('user', 'repo').then(done, done);
  });

});

describe('fromModel', function() {
  it('should set correct params', function() {

    var model = {
      login: 'aubhaze',
      token: 'fake',
      avatar_url: 'asdf'
    };
    var res = user.fromModel(model);

    expect(res.login).to.equal(model.login);
    expect(res.model).to.eql(model);

  });
});

describe('validate', function() {

  it('should return false for an invalid oauth token', function(done) {
    var aub = user.fromModel({
      login: 'aubhaze',
      token: 'fake',
      model: {}
    });
    aub.validate().then(function(res) {
      expect(res).to.be.false;
      done();
    }, done);
  });

});
