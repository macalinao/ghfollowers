var $ = require('jquery');
var config = require('../../../config.js');
var React = require('react');

var Follower = require('./Follower.jsx');

// Quick fix
if (!window.location.origin) {
  window.location.origin = window.location.protocol+"//"+window.location.host;
}

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      privilege: {
        referrals: 0,
        count: config.baseFollowers
      },
      following: []
    };
  },

  componentDidMount: function() {
    this.updateMe();
  },

  follow: function() {
    $.post('/follow/' + this.props.user.login, function(res) {
      if (res.limitReached) {
        alert('There aren\'t enough people registered to give you the full amount of followers. Invite more people!');
      }
      this.updateMe();
    }.bind(this));
  },

  updateMe: function() {
    $.get('/me', function(res) {
      this.setState({
        privilege: res.privilege,
        following: res.following
      });
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

    var followerList;
    if (this.state.following.length === 0) {
      followerList = <p>You aren't following anyone. Click the "Get Followers" button to get some followers!</p>;
    } else {
      followerList = this.state.following.map(function(follower) {
        return <Follower follower={follower} />;
      });
    }

    var getFollowers;
    if (!this.state.amount) {
      getFollowers = <p>You can't get any more followers at this time. Refer some friends to get more!</p>;
    } else {
      getFollowers = (
        <div>
          <p>You can get <strong>{this.state.amount}</strong> more followers by clicking the button below!</p>
          <button className="btn btn-primary btn-lg" onClick={this.follow}>Get Followers</button>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-12 text-center">
            <p>Hi {this.props.user.login}!</p>
            {getFollowers}
            <a className="btn btn-danger" href="/logout">Logout</a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <h2>Referrals</h2>
            <p>You've referred {people}. For each person you get to sign up using your referral link, you'll get <strong>{config.referralBonus}</strong> more followers!</p>
            <h3>Your referral link</h3>
            <input id="referLink" type="text" className="form-control" value={window.location.origin + '/?ref=' + this.props.user.login} readOnly={true} onFocus={this.selectReferLink} />
          </div>
          <div className="col-md-8">
            <h2>Your followed users</h2>
            <p>Below are the people you're following that are part of this website.</p>
            {followerList}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
