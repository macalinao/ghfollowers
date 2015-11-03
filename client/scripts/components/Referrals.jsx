import React from 'react';

import config from '../../../config';

export default React.createClass({

  selectReferLink() {
    $('#referLink').focus(() => {
      this.select();
    });
  },

  render() {

    const peopleCt = this.props.count;
    const people = peopleCt === 1 ? (peopleCt + ' person') : (peopleCt + ' people');

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
