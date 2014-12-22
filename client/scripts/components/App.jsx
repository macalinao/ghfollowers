var React = require('react');
var RouteHandler = require('react-router').RouteHandler;

var App = React.createClass({
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1>GitHub Followers</h1>
            <p>Click the button below to get <strong>free GitHub Followers</strong>!</p>
          </div>
        </div>
        <RouteHandler />
      </div>
    );
  }
});

module.exports = App;
