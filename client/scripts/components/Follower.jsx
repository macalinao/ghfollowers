var React = require('react');

module.exports = React.createClass({
  render: function() {
    var follower = this.props.follower;
    return (
      <div className="text-center follower">
        <img src={follower.avatar} className="img-rounded" width="50" height="50" />
        <p><a href={'https://github.com/' + follower.login}>{follower.login}</a></p>
      </div>
    );
  }
});
