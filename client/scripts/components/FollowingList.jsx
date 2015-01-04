var React = require('react');
var UserList = require('./UserList.jsx');

module.exports = React.createClass({
  render: function() {
    var followingList;
    if (this.props.users.length === 0) {
      followingList = <p>You aren't following anyone yet.</p>;
    } else {
      followingList = <UserList users={this.props.users} />
    }

    return (
      <div>
        <h2>People you follow</h2>
        <p>Below are the people you follow as a result of joining this website.</p>
        {followingList}
      </div>
    );
  }
});
