var config = require('../../../config.js');
var React = require('react');

module.exports = React.createClass({
  selectReferLink: function() {
    $('#referLink').focus(function() {
      this.select();
    });
  },

  render: function() {
    var peopleCt = this.props.count;
    var people = peopleCt === 1 ? (peopleCt + ' person') : (peopleCt + ' people');
    return (
      <div>
        <h2>Referrals</h2>
        <p>You've referred {people}. For each person you get to sign up using your referral link, you'll get <strong>{config.referralBonus}</strong> more followers!</p>
        <h3>Your referral link</h3>
        <input id="referLink" type="text" className="form-control" value={window.location.origin + '/?ref=' + this.props.login} readOnly={true} onFocus={this.selectReferLink} />
      </div>
    );
  }
});
