var _ = require('lodash');
var expect = require('chai').expect;
var user = require('../lib/user');
var fixtures = require('./fixtures');

describe('isFollowing', function() {
  var joe;

  beforeEach(function() {
    joe = fixtures.newJoe();
    joe.github.user.getFollowUser = function(any, cb) {
      if (any.user === 'test') cb(null, true);
      cb('error', false);
    };
  });

  it('should return true if following', function(done) {
    joe.isFollowing('test').then(function(res) {
      expect(res).to.be.true;
    }).then(done, done);
  });

  it('should return false if not following', function(done) {
    joe.isFollowing('notfollowing').then(function(res) {
      expect(res).to.be.false;
    }).then(done, done);
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
