var $ = require('jquery');
var ProgressBar = require('react-bootstrap/ProgressBar');
var React = require('react');
var UserList = require('./UserList.jsx');

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    this.loadData();
  },

  loadData: function() {
    $.get('/info/following', function(res) {
      this.setState({
        users: res
      });
    }.bind(this));
  },

  render: function() {
    var list;
    if (!this.state.users) {
      list = (
        <ProgressBar active now={100} />
      );
    } else {
      list = <UserList users={this.state.users} />
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
