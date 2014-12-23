var checkPrivilege = require('./privilege_check');
var users = require('./db').get('users');

function getUser(login, cb) {
  checkPrivilege(login, function(err, privilege) {
    users.find({
      following: login
    }, function(err, following) {
      users.findOne({
        login: login
      }, function(error, user) {
        var amount = privilege.count;
        if (user.following) {
          amount -= user.following.length;
        }

        cb(null, {
          privilege: privilege,
          following: following,
          amount: amount,
          user: user
        });

      });
    });
  });
}

module.exports = getUser;
