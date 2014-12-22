var React = require('react');

var Dashboard = React.createClass({
  render: function() {
    return (
      <div>
        <p>Welcome, {this.props.user.name}</p>
      </div>
    );
  }
});

module.exports = Dashboard;
