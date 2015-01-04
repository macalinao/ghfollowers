var $ = require('jquery');
var config = require('../../../config.js');
var React = require('react');

var UserList = require('./UserList.jsx');
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

    var followingList;
    if (this.state.me.following.length === 0) {
      followingList = <p>You aren't following anyone yet.</p>;
    } else {
      followingList = <UserList users={this.state.me.following} />
    }

    var followedByList;
    if (this.state.user && this.state.user.followedBy) {
      followedByList = (
        <ul>
          {this.state.user.followedBy.map(function(item) {
            return <li key={item}><a href={'https://github.com/' + item}>{item}</a></li>;
          })}
        </ul>
      );
    } else {
      followedByList = <p>Nobody is following you. Click the "Get Followers" button to get some followers!</p>;
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
            <h2>People you follow</h2>
            <p>Below are the people you follow as a result of joining this website.</p>
            {followingList}
            <h2>People following you</h2>
            <p>Here are the people following you from this website.</p>
            {followedByList}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
