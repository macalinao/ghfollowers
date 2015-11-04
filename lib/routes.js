import { Router } from 'express';

import checkAuth from './check_auth';
import githubOAuth from './github_oauth';
import user from './user';

export default function(app) {

  app.get('/me', checkAuth, async (req, res) => {
    res.json(await req.user.summary());
  });

  const router = new Router();
  app.use('/info', router);

  router.use(checkAuth);

  router.get('/following', async (req, res) => {
    res.json(await req.user.getFollowing());
  });

  router.get('/followers', async (req, res) => {
    await req.user.updateFollowedBy();
    res.json(await req.user.followers());
  });

  app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/user', checkAuth, function(req, res) {
    res.json(req.user.model);
  });

  app.post('/follow', checkAuth, async (req, res) => {
    let summary = await req.user.summary();
    res.json(await req.user.addFollowers(summary.amount));
  });

  app.post('/unfollow', checkAuth, async (req, res) => {
    res.json(await req.user.removeFollowers());
  });

  githubOAuth.addRoutes(app, function(err, token, res, ignore, req) {
    if (token.error) {
      return res.send('There was an error logging in: ' + token.error_description);
    }
    req.session.token = token.access_token;
    res.redirect('/');
  });

};
