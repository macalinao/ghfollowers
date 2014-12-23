function getUser(login, cb) {
  checkPrivilege(req.session.user.login, function(err, privilege) {
    users.find({
      following: req.session.user.login
    }, function(err, following) {
      users.findOne({
        login: req.session.user.login
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
