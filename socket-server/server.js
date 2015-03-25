var restify = require('restify');
var socketio = require('socket.io');
var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '1337';

var server = restify.createServer({
  name: 'Socket Server'
});

var io = socketio.listen(server.server);

// socket code below

var usersConnected = [];

io.sockets.on('connection', function (socket) {
  var username = socket.handshake.query.username;
  var currUser = {
    id: socket.id,
    username: socket.handshake.query.username
  };
  usersConnected.push(currUser);

  socket.emit('present users', usersConnected);

  socket.broadcast.emit('user connected', socket.id, username);

  socket.on('message', function (timestamp, msg) {
    socket.broadcast.emit('message', socket.id, username, timestamp, msg);
  });

  socket.on('typing', function () {
    socket.broadcast.emit('typing', socket.id, username);
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('user disconnected', socket.id);

    var i = usersConnected.indexOf(currUser);

    if(i != -1) {
    	usersConnected.splice(i, 1);
    }
  });
});

server.listen(port, function () {
  console.log('socket.io server listening at %s', server.url);
});
