module.exports = require('github-oauth')({
  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  baseURL: (process.env.NODE_ENV === 'production') ? 'http://www.githubfollowers.com' : 'http://localhost:3000',
  loginURI: '/login',
  callbackURI: '/oauth_callback',
  scope: 'user:follow'
});
