var React = require('react');

var Login = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>GitHub Followers</h1>
            <p>Click the button below to get <strong>free GitHub Followers</strong>!</p>
            <a className="btn btn-primary btn-lg" href="/login">
              Login with GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Login;
