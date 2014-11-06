//require modules
path = require("path"),
express = require('express'), 
rt = require("./routes");

var full_path = path.join(process.cwd(),'/../website/');

var app = express();

//configure
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
app.use('/', rt.router);

app.listen('8080',  function(){
	console.log('Ready on port 8080');
});

