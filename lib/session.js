var session = require('express-session');
var url = require('url');

module.exports = function(app) {

  if (process.env.NODE_ENV === 'production') {
    // Prod
    var RedisStore = require('connect-redis')(session);
    var redisUrl = url.parse(process.env.REDISTOGO_URL);
    var redisAuth = redisUrl.auth.split(':');
    app.use(session({
      store: new RedisStore({
        host: redisUrl.hostname,
        port: redisUrl.port,
        db: redisAuth[0],
        pass: redisAuth[1]
      }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
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
