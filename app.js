var _ = require('lodash');
var express = require('express');
var githubOAuth = require('github-oauth')({
  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  baseURL: (process.env.NODE_ENV === 'production') ? 'http://www.githubfollowers.com' : 'http://localhost:3000',
  loginURI: '/login',
  callbackURI: '/oauth_callback',
  scope: 'user:follow'
});

var app = express();

app.use(express.static('dist/'));

app.get('/login', githubOAuth.login);
app.get('/oauth_callback', githubOAuth.callback);

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})

githubOAuth.on('token', function(token, serverResponse) {
  console.log('here is your shiny new github oauth token', token)
  serverResponse.end(JSON.stringify(token))
})

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
