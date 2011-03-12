
/**
 * Module dependencies.
 */

var express = require('express'),
    Scraper = require('./models/TweetScraper');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  var id = null;
  if(req.param('id')==undefined){
    id = 'gowthamk';
  } else{
    id = req.param('id');
  }
  console.log("ID is "+id);
  var scraper = new Scraper(id);
  var tweets = scraper.getTweets(function(tweets){
      res.render('index', {
        title: 'Twitter Stream of '+id,
        tweets: tweets
      });
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
