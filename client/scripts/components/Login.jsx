var React = require('react');

var Login = React.createClass({
  render: function() {
    return (
      <div>
        <p>Please sign in to continue.</p>
        <a className="btn btn-primary btn-lg" href="/login">
          Login with GitHub
        </a>
      </div>
    );
  }
});

module.exports = Login;
