var React = require('react');

module.exports = React.createClass({
  render: function() {
    var followedByList;
    if (this.props.users) {
      followedByList = (
        <ul>
          {this.props.users.map(function(item) {
            return <li key={item}><a href={'https://github.com/' + item}>{item}</a></li>;
          })}
        </ul>
      );
    } else {
      followedByList = <p>Nobody is following you. Click the "Get Followers" button to get some followers!</p>;
    }

    return (
      <div>
        <h2>People following you</h2>
        <p>Here are the people following you from this website.</p>
        {followedByList}
      </div>
    );
  }
});
