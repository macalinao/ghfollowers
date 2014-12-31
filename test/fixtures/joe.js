var user = require('../../lib/user');

function newJoe() {
  var model = {
    login: 'joeuser',
    token: 'fake',
    avatar_url: 'asdf'
  };
  return user.fromModel(model);
}

module.exports = newJoe;
