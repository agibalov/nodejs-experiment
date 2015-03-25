var makeApp = require('./app');
var makeModels = require('./models');

var models = makeModels();
models.initialize().then(function() {
  var app = makeApp(models, {
    delay: 1000
  });

  var server = app.listen((process.env.PORT || 3000), function() {
    console.log('Listening at %j', server.address());
  });
}, function(error) {
  throw new Error('Failed to initialize models');
});
