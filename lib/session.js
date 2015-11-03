import session from 'express-session';

export default function(app) {

  if (process.env.NODE_ENV === 'production') {
    // Prod
    const rtg = require('url').parse(process.env.REDISTOGO_URL);
    const redis = require('redis').createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(':')[1]);

    const RedisStore = require('connect-redis')(session);
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
