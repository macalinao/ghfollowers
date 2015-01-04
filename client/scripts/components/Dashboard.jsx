var $ = require('jquery');
var config = require('../../../config.js');
var React = require('react');

var Follower = require('./Follower.jsx');
var Cap = require('./Cap.jsx');
var GetFollowers = require('./GetFollowers.jsx');
var Referrals = require('./Referrals.jsx');

// Quick fix
if (!window.location.origin) {
  window.location.origin = window.location.protocol+"//"+window.location.host;
}

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      privilege: {
        referrals: 0,
        count: config.baseFollowers,
      },
      remaining: 0,
      following: [],
      followerCt: 0
    };
  },

  componentDidMount: function() {
    this.updateMe();
  },

  unfollow: function() {
    $.post('/unfollow', function(res) {
      this.updateMe();
    }.bind(this));
  },

  updateMe: function() {
    $.get('/me', function(res) {
      this.setState({
        me: res
      });
    }.bind(this));
  },

  render: function() {

    var followingList;
    if (this.state.following.length === 0) {
      followingList = <p>You aren't following anyone yet.</p>;
    } else {
      followingList = this.state.following.map(function(follower) {
        return <Follower key={follower.login} follower={follower} />;
      });
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
            <h2>Remove Followers</h2>
            <p>Don't want to be popular anymore? Click the below button to remove all of your followers!</p>
            <button className="btn btn-primary" onClick={this.unfollow}>Remove Followers</button>
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
