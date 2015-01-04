var React = require('react');

module.exports = React.createClass({
  unfollow: function() {
    $.post('/unfollow', function(res) {
      this.props.onUnfollow();
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        <h2>Remove Followers</h2>
        <p>Don't want to be popular anymore? Click the below button to remove all of your followers!</p>
        <button className="btn btn-primary" onClick={this.unfollow}>Remove Followers</button>
      </div>
    );
  }
});
