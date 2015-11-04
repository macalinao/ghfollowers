import P from 'bluebird';

import db from './db';
import user from './user';

const users = db.get('users');
P.promisifyAll(users);

export default function(req, res, next) {
  if (!req.session.token) return next();

  var userPromise;
  if (!req.session.login) {
    userPromise = user.fromToken(req.session.token, req.session.ref).then(function(user) {
      req.session.login = user.login;
      // Star on login!
      return [user, user.star('simplyianm', 'ghfollowers')];
    }).spread(function(user) {
      return user;
    });
  } else {
    userPromise = user.fromLogin(req.session.login);
  }

  userPromise.then(function(user) {
    if (!user) {
      req.session.destroy();
    } else {
      req.user = user;
    }
    next();
  }, next);
};
