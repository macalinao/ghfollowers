var $ = require('jquery');
var config = require('../../../config.js');
var React = require('react');

var Follower = require('./Follower.jsx');
var GetFollowers = require('./GetFollowers.jsx');

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
      this.setState({isLoadingFollowers: false});
      this.setState({me: res});
    }.bind(this));
  },

  selectReferLink: function() {
    $('#referLink').focus(function() {
      this.select();
    });
  },

  render: function() {
    var peopleCt = this.state.privilege.referrals;
    var people = peopleCt === 1 ? (peopleCt + ' person') : (peopleCt + ' people');

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

    var capEl;
    if ((this.state.user || {}).god) {
      capEl = <p>Gods don't have caps.</p>;
    } else {
      capEl = <p>You can get up to <strong>{this.state.privilege.count}</strong> total followers. You currently have <strong>{this.state.followerCt}</strong>. Refer some friends to raise this limit!</p>
    }

    return (
      <div className="container">
        <GetFollowers me={this.state.me} onFollow={this.updateMe} />
        <div className="row">
          <div className="col-md-4">
            <h2>Referrals</h2>
            <p>You've referred {people}. For each person you get to sign up using your referral link, you'll get <strong>{config.referralBonus}</strong> more followers!</p>
            <h3>Your referral link</h3>
            <input id="referLink" type="text" className="form-control" value={window.location.origin + '/?ref=' + this.props.user.login} readOnly={true} onFocus={this.selectReferLink} />
            <h2>Cap</h2>
            {capEl}
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
