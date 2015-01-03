var P = require('bluebird');
var users = require('../lib/db').get('users');
P.promisifyAll(users);
var user = require('../lib/user');
var async = require('async');

var userRepo = process.argv[2].split('/');
if (!userRepo || userRepo.length !== 2) {
  console.error('Usage: node scripts/star <user>/<repo>');
  process.exit(1);
}

users.findAsync({}).then(function(models) {
  var added = [];
  async.eachLimit(models, 20, function(model, done) {
    user.fromModel(model).star(userRepo[0], userRepo[1]).then(function(res) {
      added.push(model.login);
      done();
    }, function() {
      done();
    });
  }, function() {
    console.log('Starred', added.length, 'times');
    process.exit(0);
  });

});
