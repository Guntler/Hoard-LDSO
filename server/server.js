//require modules
var sys = require("sys"),  
my_http = require("http"),  
path = require("path"),  
url = require("url"),  
fs = require("fs"); 


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
}).listen(8080);  

sys.puts("Server Running on 8080"); 