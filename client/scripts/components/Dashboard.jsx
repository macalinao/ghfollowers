var $ = require('jquery');
var React = require('react');

var Dashboard = React.createClass({
  follow: function() {
    $.post('/follow/' + this.props.user.login, function(res) {
      console.log(res);
    });
  },
  render: function() {
    return (
      <div>
        <p>Welcome, {this.props.user.login}</p>
        <button onClick={this.follow}>Get Followers</button>
      </div>
    );
  }
});

module.exports = Dashboard;
