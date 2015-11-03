import $ from 'jquery';
import React from 'react';

import config from '../../../config';

import Cap from './Cap.jsx';
import FollowingList from './FollowingList.jsx';
import FollowedByList from './FollowedByList.jsx';
import GetFollowers from './GetFollowers.jsx';
import RemoveFollowers from './RemoveFollowers.jsx';
import Referrals from './Referrals.jsx';

// Quick fix
if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.host;
}

export default React.createClass({

  getInitialState() {
    return {
      followers: null,
      following: null
    };
  },

  componentDidMount() {
    this.updateMe();
  },

  updateMe() {
    $.get('/me', (res) => {
      this.setState({
        me: res
      });
    });
    this.loadFollowers();
    this.loadFollowing();
  },

  loadFollowers() {
    $.get('/info/followers', (res) => {
      this.setState({
        followers: res
      });
    });
  },

  loadFollowing() {
    $.get('/info/following', (res) => {
      this.setState({
        following: res
      });
    });
  },

  render() {

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
            <FollowingList users={this.state.following} />
            <FollowedByList users={this.state.followers} />
          </div>
        </div>
      </div>
    );
  }

});
