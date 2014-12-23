var checkPrivilege = require('./privilege_check');
var users = require('./db').get('users');

function getUser(login, cb) {
  checkPrivilege(login, function(err, privilege) {
    users.find({
      followedBy: login
    }, function(err, following) {
      users.findOne({
        login: login
      }, function(error, user) {
        var amount = privilege.count;
        if (user.followedBy) {
          amount -= user.followedBy.length;
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
