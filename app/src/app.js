var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var session = require('express-session');
var config = require('./config');

require('./api/enhance');
var router = require('./router');

var app = express();
if (!process.env.NODE_ENV) {
  app.use(logger('dev'));
} else {
  var accessLogStream = FileStreamRotator.getStream({
    filename: path.join(__dirname, '../logs/accss-%DATE%.log'),
    frequency: 'daily',
    verbose: false
  });
  app.use(logger('combined', { stream: accessLogStream }));
}
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: false }));
app.use(cookieParser());
app.use(session({
  name: config.cookie_name,
  secret: 'doc2doc',
  resave: false,
  rolling: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 3600 * 24
  }
}));
app.use(express.static(path.join(__dirname, '../public')));
router(app);
app.use(function (req, res, next) {
  res.status(404).end();
});
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({
    success: false,
    message: 'Error: ' + err.message
  });
});

module.exports = app;