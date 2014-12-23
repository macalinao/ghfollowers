var express = require('express');
var app = express();

// Enable sessions
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Prerender for SEO
app.use(require('prerender-node'));

// Middleware to add GH user to request object
app.use(require('./lib/github_user_middleware'));

// SPA
app.use(express.static('dist/'));

// Routes
require('./lib/routes')(app);

// Bind to port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
