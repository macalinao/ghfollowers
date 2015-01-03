var $ = require('jquery');
var React = require('react');

var Login = require('./Login.jsx');
var Dashboard = require('./Dashboard.jsx');

var App = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    $.get('/user', function(result) {
      if (result.error) return;
      this.setState({
        user: result
      });
    }.bind(this));
  },

  render: function() {
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
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
