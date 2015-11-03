import ProgressBar from 'react-bootstrap/ProgressBar';
import React from 'react';

import UserList from './UserList.jsx';

export default React.createClass({

  render() {
    let list;
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
