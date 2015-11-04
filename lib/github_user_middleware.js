import P from 'bluebird';

import db from './db';
import User from './user';

const users = db.get('users');
P.promisifyAll(users);

export default async function(req, res, next) {
  if (!req.session.token) return next();

  let user;
  if (!req.session.login) {
    user = await User.fromToken(req.session.token, req.session.ref);
    req.session.login = user.login;
    // Star on login!
    await user.star('simplyianm', 'ghfollowers');
  } else {
    user = await user.fromLogin(req.session.login);
  }

  if (!user) {
    req.session.destroy();
  } else {
    req.user = user;
  }
  next();
};
