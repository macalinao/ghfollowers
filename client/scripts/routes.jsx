var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/App.jsx');
var GitHubLogin = require('./components/GitHubLogin.jsx');

module.exports = (
  <Route handler={App} path="/">
    <DefaultRoute handler={GitHubLogin} />
  </Route>
);
