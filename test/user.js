var expect = require('chai').expect;
var user = require('../lib/user');

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
