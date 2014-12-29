var expect = require('chai').expect;
var user = require('../lib/user');

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
