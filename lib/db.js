module.exports = require('monk')(process.env.MONGOHQ_URL || 'mongodb://localhost:27017/ghfollowers');
