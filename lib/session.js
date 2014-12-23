var session = require('express-session');

module.exports = function(app) {

  if (process.env.NODE_ENV === 'production') {
    // Prod
    var rtg = require('url').parse(process.env.REDISTOGO_URL);
    var redis = require('redis').createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(':')[1]);

    var RedisStore = require('connect-redis')(session);
    app.use(session({
      store: new RedisStore({
        client: redis
      }),
      secret: 'keyboard cat'
    }));

  } else {
    // Devel
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
    }));

  }

};
