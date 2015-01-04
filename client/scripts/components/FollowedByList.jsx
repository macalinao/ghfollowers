var $ = require('jquery');
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
    $.get('/info/followers', function(res) {
      this.setState({
        users: res
      });
    }.bind(this));
  },

  render: function() {
    var list;
    if (!this.state.users) {
      list = <p>Loading...</p>;
    } else {
      list = <UserList users={this.state.users} />
    }

    return (
      <div>
        <h2>People following you</h2>
        <p>Here are the people following you from this website.</p>
        {list}
      </div>
    );
  }
});
