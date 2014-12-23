var $ = require('jquery');
var React = require('react');

// Quick fix
if (!window.location.origin) {
  window.location.origin = window.location.protocol+"//"+window.location.host;
}

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      privilege: {
        referrals: 0,
        count: require('../../../config.js').baseFollowers
      }
    };
  },

  componentDidMount: function() {
    $.get('/privilege', function(res) {
      this.setState({
        privilege: res
      });
    }.bind(this));
  },

  follow: function() {
    $.post('/follow/' + this.props.user.login, function(res) {
      console.log(res);
    });
  },

  selectReferLink: function() {
    $('#referLink').focus(function() {
      this.select();
    });
  },

  render: function() {
    var peopleCt = this.state.privilege.referrals;
    var people = peopleCt === 1 ? (peopleCt + ' person') : (peopleCt + ' people');

    return (
      <div>
        <div className="row">
          <div className="col-md-12 text-center">
            <p>Welcome, {this.props.user.login}</p>
            <button className="btn btn-primary btn-lg" onClick={this.follow}>Get Followers</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <h2>Referrals</h2>
            <p>You've referred {people}. When you get people to sign up using your referral link, you'll get more followers!</p>
            <h3>Your referral link</h3>
            <input id="referLink" type="text" className="form-control" value={window.location.origin + '/?ref=' + this.props.user.login} readOnly={true} onFocus={this.selectReferLink} />
          </div>
          <div className="col-md-8">
            <h2>Your followed users</h2>
            <p>Below are the people you're following that are part of this website.</p>
            ...todo...
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
