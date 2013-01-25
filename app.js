
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , image = require('./routes/image')
  , http = require('http')
  , path = require('path')
  , redis = require('redis')
  , db = redis.createClient();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname, '/images'));
  app.use(function(req, res, next) {
    res.send(404, '404 - Something has gone awry..');
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index); 
app.post('/images', image.create);  // Add new image
app.all('/images', image.list);     // Retrieve all images
app.get('/images/remove', image.remove);
app.get('/images/:id', image.view); // View image
app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
