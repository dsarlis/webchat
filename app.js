var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var routes = require('./routes/index');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var db = new sqlite3.Database('chat.db');
db.run('CREATE TABLE messages (name TEXT, msg TEXT, date TEXT)', function(err) {
  if (err !== null) {
    console.log("Table already exists!");
  } else {
    console.log("Successfully created table!");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

server.listen(8080, function() {
  console.log('Listening on *:8080');
});

// store message info in database
var storeMessage = function(message){
  var stmt = db.prepare('INSERT INTO messages VALUES(?, ?, ?)');
  stmt.run(message.name, message.msg, message.date);
  stmt.finalize();
};


// socket io operations
io.on('connection', function(client) {
  client.on('join', function(nickname) { 
    console.log(nickname + ' joined FSE chatroom');
    client.nickname = nickname;
    db.each('SELECT name, msg, date FROM messages', function (err, row) {
      client.emit('chat message', row);
    });
  });
  client.on('chat message', function(message) {
    console.log('message: ' + message.msg + " date: " + message.date);
    message.name = client.nickname;
    client.broadcast.emit('chat message', message);
    client.emit('chat message', message);
    storeMessage(message);
  });
  client.on('disconnect', function() {
    var name = client.nickname;
    console.log(name + " has left FSE chatroom");
  });
});

module.exports = app;
