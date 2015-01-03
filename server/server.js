//require modules
var path 			= require("path"),
	express			= require('express'), 
	passport 		= require('passport'),
	session 		= require('express-session'),
	bodyParser 		= require('body-parser'),
	cookieParser 	= require('cookie-parser'),
	flash			= require('connect-flash'),
	http			= require('http'),
	https			= require('https'),
	fs				= require('fs');

var full_path = path.join(process.cwd(),'../www/');

var privateKey  = fs.readFileSync('ssl/key.key', 'utf8');
var certificate = fs.readFileSync('ssl/cert.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express();

//configure
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '10mb'}));
app.use(session( {secret: 'hoardingisfun', saveUninitialized: true, resave: true} ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs'); //poderá eventualmente alterado para jade
app.set('views', full_path);

app.use("/css", express.static(full_path + '/css'));
app.use("/js", express.static(full_path + '/js'));
app.use("/images", express.static(full_path + '/images'));
app.use("/jquery", express.static(full_path + '/jquery'));
app.use("/angular", express.static(full_path + '/angular'));

app.use("/semantic/css", express.static(full_path + '/semantic/css'));
app.use("/semantic/javascript", express.static(full_path + '/semantic/javascript'));
app.use("/semantic/fonts", express.static(full_path + '/semantic/fonts'));
app.use("/semantic/images", express.static(full_path + '/semantic/images'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//define routes
require('./routes')(app, passport);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

/*app.listen('8081',  function(){ //8081 porque é o jenkins no 8080
	console.log('Ready on port 8081');
});*/


httpServer.listen(8081, function() {
	console.log('Ready on port 8081');
});
httpsServer.listen(443, function() {
	console.log('Ready on port 443');
});

