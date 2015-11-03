import React from 'react';

import User from './User.jsx';

export default React.createClass({

  render() {
    return (
      <div>
        {this.props.users.map((user) => {
          return <User key={user.login} user={user} />;
        })}
      </div>
    );
  }

});
