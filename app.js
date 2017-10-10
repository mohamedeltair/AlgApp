var express = require('express'),
bodyParser = require('body-parser'),
cookieParser=require('cookie-parser'),
logger = require('morgan'),
path = require('path'),
fs = require('fs'),
http = require('http');


var io = require('socket.io');

var app = express();

app.set('port', process.env.PORT || 3000);
var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var listener = io.listen(httpServer);

listener.sockets.on('connection', function(socket){
	socket.on('cl', function(data) {
		socket.emit('nt', {'d': "Received"});
	});
});

var routes = require('./routes/main');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.use('/', routes);

app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status=404;
	next(err);
});

