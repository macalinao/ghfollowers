var React = require('react');
var UserList = require('./UserList.jsx');
var ProgressBar = require('react-bootstrap/ProgressBar');

module.exports = React.createClass({
  render: function() {
    var list;
    if (!this.props.users) {
      list = (
        <ProgressBar active now={100} />
      );
    } else {
      list = <UserList users={this.props.users} />
    }

    return (
      <div>
        <h2>People you follow</h2>
        <p>Below are the people you follow as a result of joining this website.</p>
        {list}
      </div>
    );
  }
});
