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
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>GitHub Followers</h1>
            <p className="subtitle">Get <strong>free GitHub followers</strong> by automatically following other users.</p>
            {page}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
