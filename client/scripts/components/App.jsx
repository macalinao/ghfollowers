var $ = require('jquery');
var React = require('react');

var Login = require('./Login.jsx');

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
      page = <p>Test</p>;
    }
    return (
      <div>
        {page}
      </div>
    );
  }
});

module.exports = App;
