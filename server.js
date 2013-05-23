var port = process.env.PORT || 5000;
var express = require('express');
var app = express();
//Require for socket.io v0.9.x (need http server)
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10); 
});
var user = require('./models/user');

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Set static to public root
app.use(express.static(__dirname + '/public'));

// Optional since express defaults to CWD/views
app.set('views', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

//start server
server.listen(port);

app.get('/', function(req, res){
	  res.render('index', {
		content: "Welcome to my test site",
		title: "Home page",
		header: "Welcome page"
	  });
});

app.get('/users', function(req, res){
	user.getAll(function(rows){
		res.render('users', {
			title: "EJS example",
			header: "Some users",
			users: rows
		});
	});
});

app.get('/socket', function(req, res){
	  res.render('socket', {
		title: "EJS example",
		header: "Some users"
	  });
});

app.get('/insert', function(req, res){
	  res.render('insert', {
		title: "EJS example",
		header: "Some users"
	  });
});

app.get('/login', function(req, res){
	res.render('login', {

	});
});

io.on('connection', function(socket){
	socket.on('messagesent', function(data){
		res = JSON.parse(data);
		console.log('Received expression from client ', res.name + ': '+ res.mes);
		// catch error for bad expression
		try{
			socket.emit('messagereceived', res.name + ': '+ res.mes);
			socket.broadcast.emit('messagereceived', res.name + ': '+ res.mes);
		}catch(err){
			socket.emit("error",err.message);
		}
	});
	
	socket.on('insert', function(data){
		var res = JSON.parse(data);
		
		user.add(res, function(id){
			if(id) {
				user.getById(id, function(rows){
					try{
						socket.emit('insert success', rows);
						socket.broadcast.emit('insert success', rows);
					}catch(err){
						socket.emit("error", err.message);
					}
				});
			}
		});
	});
	
	socket.on('disconnect', function(){
		console.log('Disconnected');
	});
});
/*
this.handleDisconnect = function(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
};

this.handleDisconnect(connection);
*/

