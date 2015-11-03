import $ from 'jquery';
import React from 'react';

export default React.createClass({
  getInitialState() {
    return {
      isUnfollowing: false
    };
  },

  unfollow() {
    this.setState({ isUnfollowing: true });
    $.post('/unfollow', (res) => {
      this.setState({ isUnfollowing: false });
      this.props.onUnfollow();
    });
  },

  render() {
    return (
      <div>
        <h2>Remove Followers</h2>
        <p>Don't want to be popular anymore? Click the below button to remove all of your followers!</p>
        <button className="btn btn-primary" onClick={this.unfollow} disabled={this.state.isUnfollowing}>{this.state.isUnfollowing ? 'Loading...' : 'Remove Followers'}</button>
      </div>
    );
  }

});
