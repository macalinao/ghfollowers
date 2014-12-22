var express = require('express');
var app = express();

app.use(express.static('dist/'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});
