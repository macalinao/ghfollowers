var React = require('react');
var User = require('./User.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.users.map(function(user) {
          return <User key={user.login} user={user} />;
        })}
      </div>
    );
  }
});
