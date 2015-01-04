var React = require('react');

module.exports = React.createClass({
  render: function() {
    var user = this.props.user;
    return (
      <div className="text-center user">
        <img src={user.avatar} className="img-rounded" width="50" height="50" />
        <p><a href={'https://github.com/' + user.login}>{user.login}</a></p>
      </div>
    );
  }
});
