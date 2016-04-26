
// Steps
// 1. Initialize the app with the express generator.
// -- express electric-or-not
// -- This will create an entire folder structure with everything we need to get started making an epxress web (dub dub dub) application
// 2. add a .gitignore file that will (at least) ignore everythign inside of node_modules
// -- reason for this? If someone wants to run your app, they can do an npm install themselves. These moduels should not be committed to the repository unless there is a very good reason. 
// 3. Copy the compass boilerplate into the project.
// -- this will give you access to compass. We need to change teh rb config file to write to teh correct place.
// -- -- This means changing the path of the css write directory to ../public/stylesheets
// -- -- Set up includes for head, nav, footer so we could make use of multiple stylesheets
// 4. Initialize git (the repo) or start it up in GitHub Desktop
// -- from the command line:
// -- -- git init
// -- -- git add * (this will add ALL files in teh directory to be commited)
// -- -- git commit -m "Init commit to github"
// -- -- git add remote origin/open up github desktop
// 5. npm install ejs --save
// 6. npm install mongodb --save
// -- These two steps will get two more modules from the npm market for us to use in our app.
// 7. npm install
// -- this will install express, all it's dependecies, etc. Whatever is inisde of pacakge.json
// 8. SANITY CHECK. RUN NODEMON.
// 9. Switch the templating engine (if desired) from Jade.
// -- in app.js (where we are at) go down to the app.set and change it from jade, to ejs.
// -- in the views folder, change .jade files to .ejs files. (this involves a little syntax change in the error.jade file)
// 10. In index.ejs, set up our common files and include them
// - head
// - nav
// - footer
// 11. Set up a wrapper div to hold our voting buttons and our image
// 12. Style the home page
// 13. Set up an test the connection to Mongo.
// 14. Jumpt down to home page route for next steps.

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
