import $ from 'jquery';
import React from 'react';

import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';

export default React.createClass({

  getInitialState() {
    return {
      user: null
    };
  },

  componentDidMount() {
    $.get('/user', (result) => {
      if (result.error) return;
      this.setState({
        user: result
      });
    });
  },

  render() {
    var page;
    if (!this.state.user) {
      page = <Login />;
    } else {
      page = <Dashboard user={this.state.user} />;
    }
    return (
      <div>
        {page}
        <div className="container">
          <div className="row padded">
            <div className="col-md-12 text-center">
              <p>Made by <a href="https://twitter.com/simplyianm">@simplyianm</a>. <a href="https://github.com/simplyianm/githubfollowers">View on GitHub</a></p>
              <p>The Octocat logo is property of GitHub, Inc.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
