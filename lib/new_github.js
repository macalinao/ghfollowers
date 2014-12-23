var GitHubApi = require('github');

module.exports = function newGithub(token) {
  var api = new GitHubApi({
    version: '3.0.0'
  });
  api.authenticate({
    type: 'oauth',
    token: token
  });
  return api;
}
