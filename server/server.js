//require modules
var sys = require("sys"),  
my_http = require("http"),  
path = require("path"),  
url = require("url"),  
fs = require("fs"),
express = require('express'), 
routes = require("./routes"),
api = require("./routes/api"),
pg  = require("pg");


var conString = "pg://postgres:armindo@localhost:5432/HoardDataBase";



var full_path = path.join(process.cwd(),'/../website/');

app = express();

<<<<<<< HEAD
/*
	app.use("/css", express.static(full_path + '/css'));
	app.use("/javascript", express.static(full_path + '/javascript'));
	app.use("/images", express.static(full_path + '/images'));
	app.use("/jquery", express.static(full_path + '/jquery'));
	
	app.use("/semantic/css", express.static(full_path + '/semantic/css'));
	app.use("/semantic/javascript", express.static(full_path + '/semantic/javascript'));
	app.use("/semantic/fonts", express.static(full_path + '/semantic/fonts'));
	app.use("/semantic/images", express.static(full_path + '/semantic/images'));
	
	*/
	app.listen('8080',  function(){
	
		console.log('ready on port 8080');
	
	});
=======
//configure
app.set('view engine', 'ejs'); //poderá eventualmente alterado para jade
app.set('views', full_path);

app.use("/css", express.static(full_path + '/css'));
app.use("/javascript", express.static(full_path + '/javascript'));
app.use("/images", express.static(full_path + '/images'));
app.use("/jquery", express.static(full_path + '/jquery'));
>>>>>>> f9389b898c30140d9b2f955b7a9be9087beabd3b

app.use("/semantic/css", express.static(full_path + '/semantic/css'));
app.use("/semantic/javascript", express.static(full_path + '/semantic/javascript'));
app.use("/semantic/fonts", express.static(full_path + '/semantic/fonts'));
app.use("/semantic/images", express.static(full_path + '/semantic/images'));

//define routes
app.get('/', routes.index);
app.get('/p/user/:name', routes.userpages);
app.get('/p/product/:name', routes.productpages);
app.get('/api/users', api.users);
app.get('*', routes.index);


app.listen('8080',  function(){

	console.log('ready on port 8080');

});
