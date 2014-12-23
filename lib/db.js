module.exports = require('monk')(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/ghfollowers');
