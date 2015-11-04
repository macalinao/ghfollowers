import P from 'bluebird';
import bodyParser from 'body-parser';
import express from 'express';
import prerender from 'prerender-node';

import githubUserMiddleware from './lib/github_user_middleware';
import routes from './lib/routes';
import session from './lib/session';

P.onPossiblyUnhandledRejection(function(e, promise) {
  console.error('Unhandled error!');
  console.error(e.stack ? e.stack : e);
});

var app = express();

// Enable sessions
session(app);

// Body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// Prerender for SEO
app.use(prerender);

// Middleware to add GH user to request object
app.use(githubUserMiddleware);

// Referral links
app.use(function(req, res, next) {
  if (req.query.ref) {
    req.session.ref = req.query.ref;
  }
  next();
});


// SPA
app.use(express.static('dist/'));

if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}

// Ghetto error handling
app.use(function(err, req, res, next) {
  var print = err.stack ? err.stack : err;
  console.error(print);
  res.send(print);
});

// Routes
routes(app);

// Bind to port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
