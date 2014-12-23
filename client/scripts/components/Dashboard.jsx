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
      <div className="row">
        <div className="col-md-12 text-center">
          <p>Welcome, {this.props.user.login}</p>
          <button className="btn btn-primary btn-lg" onClick={this.follow}>Get Followers</button>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
