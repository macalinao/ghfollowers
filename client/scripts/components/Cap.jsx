import React from 'react';

export default React.createClass({

  render() {
    const { me } = this.props;
    let message;
    if (me.user.god) {
      message = <p>Gods don't have caps.</p>;
    } else {
      message = <p>You can get up to <strong>{me.privilege.count}</strong> total followers. You currently have <strong>{me.followerCt}</strong>. Refer some friends to raise this limit!</p>
    }

    return (
      <div>
        <h2>Cap</h2>
        {message}
      </div>
    );
  }

});
