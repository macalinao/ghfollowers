var $ = require('jquery');
var config = require('../../../config.js');
var React = require('react');

var FollowingList = require('./FollowingList.jsx');
var FollowedByList = require('./FollowedByList.jsx');
var Cap = require('./Cap.jsx');
var GetFollowers = require('./GetFollowers.jsx');
var RemoveFollowers = require('./RemoveFollowers.jsx');
var Referrals = require('./Referrals.jsx');

// Quick fix
if (!window.location.origin) {
  window.location.origin = window.location.protocol+"//"+window.location.host;
}

var Dashboard = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    this.updateMe();
  },

  updateMe: function() {
    $.get('/me', function(res) {
      this.setState({
        me: res
      });
    }.bind(this));
  },

  render: function() {

    if (!this.state.me) {
      return (
        <div className="container">
          <div className="col-md-12 text-center">
            <h1>Loading...</h1>
            <i className="fa fa-4x fa-spinner fa-spin"></i>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <GetFollowers me={this.state.me} onFollow={this.updateMe} />
        <div className="row">
          <div className="col-md-4">
            <Referrals count={this.state.me.privilege.referrals} login={this.state.me.user.login} />
            <Cap me={this.state.me} />
            <RemoveFollowers onUnfollow={this.updateMe} />
          </div>
          <div className="col-md-8">
            <FollowingList users={this.state.me.following} />
            <FollowedByList />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
