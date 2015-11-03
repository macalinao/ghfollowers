import React from 'react';

export default React.createClass({

  render() {
    const { user } = this.props;
    return (
      <div className="text-center user">
        <img src={user.avatar} className="img-rounded" width="50" height="50" />
        <p><a href={'https://github.com/' + user.login} target="_blank">{user.login}</a></p>
      </div>
    );
  }

});
