var pg = require("pg");
var favoriteProducts = require("./models/FavoriteProduct.js");

//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/hoard_db";


var client = new pg.Client(conString);

	client.connect();
//exemplo de insert - erros impressos na consola 
    client.query(
	'INSERT INTO useraccount (email, password, permissions, registerdate) values($1, $2, $3, $4) RETURNING userid', 
					['Rons.pt', 'dsddsddsdaddsdfvcc', 'User', new Date()],
            function(err, result) {
                if (err) {
                    console.log(err);
					client.end();
                } else {
                    console.log('row inserted with id: ' + result.rows[0].userid);
                
				}
				
				}
	
	 );
	
	
	
	
	
	
	