//require modules
var sys = require("sys"),  
my_http = require("http"),  
path = require("path"),  
url = require("url"),  
fs = require("fs"),
express =  require('express');

var full_path = path.join(process.cwd(),'/../website/');

	app = express();
	console.log(full_path);
	//configure
	app.set('view engine', 'ejs'); //poderá eventualmente alterado para jade
	app.set('views', full_path);
	
	//define routes
	app.get('/', function(req, res)
	{
		res.render('home');
			
	
	});
	app.use("/css", express.static(full_path + '/css'));
	app.use("/javascript", express.static(full_path + '/javascript'));
	app.use("/semantic/css", express.static(full_path + '/semantic/css'));
	app.use("/semantic/javascript", express.static(full_path + '/semantic/javascript'));
	app.use("/semantic/fonts", express.static(full_path + '/semantic/fonts'));

	app.use("/images", express.static(full_path + '/images'));
	app.use("/jquery", express.static(full_path + '/jquery'));

	
	app.listen('8080',  function(){
	
		console.log('ready ond port 8080');
	
	});

/*	
	//create http server 
my_http.createServer(function(request,response){  
    var my_path = url.parse(request.url).pathname;  
    var full_path = path.join(process.cwd(),'/../website/');
	var full_path = path.join(full_path, my_path);

	
	//check if path exists
    fs.exists(full_path,function(exists){ 
        if(!exists){  //handle database requests here 
            response.writeHeader(404, {"Content-Type": "text/plain"});    
            response.write("404 Not Found\n");    
            response.end();  
        }  
        else{  
			if(fs.lstatSync(full_path).isDirectory()) {
		
				fs.readFile(path.join(process.cwd(),'/../website/home.html'), "binary", function(err, file) {    
					if(err) {    
						 response.writeHeader(500, {"Content-Type": "text/plain"});    
						 response.write(err + "\n");    
						 response.end();    
					 
					 }    
					 else{  
						response.writeHeader(200, {"Content-Type": "text/html"});    
						response.write(file, "binary");    
						response.end();  
					}  
						   
				});  
				//response.writeHeader(200, {"Content-Type": "text/html"});
				//response.write(file, "binary");    
                //response.end();  
			}
			else{//parse file type
			var extname = path.extname(full_path);
			var contentType = 'text/html';

			switch (extname) {
				case '.js':
					contentType = 'text/javascript';
					break;
				case '.css':
					contentType = 'text/css';
					break;
				case '.png':
					contentType = 'image/png';
					break;
				case '.jpg':
					contentType = 'image/jpg';
					break;
			}
			
			//send response
            fs.readFile(full_path, "binary", function(err, file) {    
                 if(err) {    
                     response.writeHeader(500, {"Content-Type": "text/plain"});    
                     response.write(err + "\n");    
                     response.end();    
                 
                 }    
                 else{  
                    response.writeHeader(200, {"Content-Type": contentType});    
                    response.write(file, "binary");    
                    response.end();  
					}  
                       
				});  
			}  
		}
	});  
<<<<<<< HEAD
}).listen(8080);  */

//sys.puts("Server Running on 8080"); 
//=======
//}).listen(8081);  
//sys.puts("Server Running on 8080"); 
//>>>>>>> 7ce90e04b682f554a512879e4c379025c96e118c
