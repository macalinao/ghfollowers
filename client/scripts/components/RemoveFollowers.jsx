var $ = require('jquery');
var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      isUnfollowing: false
    };
  },

  unfollow: function() {
    this.setState({isUnfollowing: true});
    $.post('/unfollow', function(res) {
      this.setState({isUnfollowing: false});
      this.props.onUnfollow();
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <h2>Remove Followers</h2>
        <p>Don't want to be popular anymore? Click the below button to remove all of your followers!</p>
        <button className="btn btn-primary" onClick={this.unfollow} disabled={this.state.isUnfollowing}>{this.state.isUnfollowing ? 'Loading...' : 'Remove Followers'}</button>
      </div>
    );
  }
});
