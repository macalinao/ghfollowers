var $ = require('jquery');
var React = require('react');

// Quick fix
if (!window.location.origin) {
  window.location.origin = window.location.protocol+"//"+window.location.host;
}

var Dashboard = React.createClass({
  follow: function() {
    $.post('/follow/' + this.props.user.login, function(res) {
      console.log(res);
    });
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12 text-center">
          <p>Welcome, {this.props.user.login}</p>
          <button className="btn btn-primary btn-lg" onClick={this.follow}>Get Followers</button>
          <p>You've invited x people.</p>
          <h3>Your referral link</h3>
          <input type="text" value={window.location.origin + '/?ref=' + this.props.user.login} />
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
