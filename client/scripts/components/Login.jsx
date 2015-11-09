import React from 'react';

export default React.createClass({

  render() {
    const loginLink = '/login' + (this.props.ref ? '?ref=' + this.props.ref : '');
    return (
      <div>
        <div className="jumbotron splash">
          <div className="container splash-text">
            <div className="row">
              <div className="col-md-12">
                <h1>Get GitHub followers.</h1>
                <p>Increase your follower count with the click of a button.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <a className="btn btn-github btn-lg" href={loginLink}>
                  Login with GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <h2>How it works</h2>
              <p>Ever wondered <strong>how to get more GitHub followers</strong>? <strong>GitHub Followers</strong> uses your OAuth2 token from GitHub's API to follow other users registered with our website. In return, we use those tokens to have them follow you back.</p>
            </div>
            <div className="col-md-4">
              <h2>Is this allowed? Is it safe?</h2>
              <p><strong>Absolutely.</strong> The GitHub terms of service only state that you are responsible for all activity that occurs under your account. Because all we ask for are the <code>user:follow</code> and <code>public_repo</code> (for starring our repo) permissions, we can't do anything malicious with your account. In fact, the source code to this website is available <a href="https://github.com/simplyianm/ghfollowers">here</a>!</p>
            </div>
            <div className="col-md-4">
              <h2>Can I unfollow users you've followed for me?</h2>
              <p><strong>Yes, but you'll permanently lower your cap.</strong> This app depends on having legitimate, non-botted people following each other, so breaking the trust destroys our service. We'll lower your follower cap to compensate for the unfollowed user.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
