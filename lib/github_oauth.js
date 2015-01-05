module.exports = require('github-oauth')({
  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  baseURL: (process.env.NODE_ENV === 'production') ? 'http://githubfollowers.com' : 'http://localhost:3000',
  loginURI: '/login',
  callbackURI: '/oauth_callback',
  scope: 'user:follow,public_repo'
});
