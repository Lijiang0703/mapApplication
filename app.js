var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var map = require('./public/js/mapdetail.js');

app.use(express.static('public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/map.html');
});
io.on('connection', function(socket){
  console.log('a user connected');
  // var _map = new map.openMap();
    // map.init();
  // socket.on('disconnect', function(){
    // console.log('user disconnected');
  // });
  socket.on('push loc',function(loc){
  	console.log('push loc');
	io.emit('others location',loc);
  })
 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});