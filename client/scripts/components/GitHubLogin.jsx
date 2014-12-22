var React = require('react');

var GitHubLogin = React.createClass({
  render: function() {
    return (
      <a className="btn btn-primary btn-lg" href="/login">
        Login with GitHub
      </a>
    );
  }
});

module.exports = GitHubLogin;
