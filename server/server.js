//require modules
var path 			= require("path"),
	express			= require('express'), 
	passport 		= require('passport'),
	session 		= require('express-session'),
	bodyParser 		= require('body-parser'),
	cookieParser 	= require('cookie-parser'),
	flash			= require('connect-flash');

var full_path = path.join(process.cwd(),'/../website/');

var app = express();

//configure
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session( {secret: 'hoardingisfun', saveUninitialized: true, resave: true} ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs'); //poderá eventualmente alterado para jade
app.set('views', full_path);

app.use("/css", express.static(full_path + '/css'));
app.use("/javascript", express.static(full_path + '/javascript'));
app.use("/images", express.static(full_path + '/images'));
app.use("/jquery", express.static(full_path + '/jquery'));

app.use("/semantic/css", express.static(full_path + '/semantic/css'));
app.use("/semantic/javascript", express.static(full_path + '/semantic/javascript'));
app.use("/semantic/fonts", express.static(full_path + '/semantic/fonts'));
app.use("/semantic/images", express.static(full_path + '/semantic/images'));

//define routes
require('./routes')(app, passport);

app.listen('8080',  function(){
	console.log('Ready on port 8080');
});

