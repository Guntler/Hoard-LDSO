//example de query de select
//tabela useraccount

var pg = require("pg");
var favoriteProducts = require("./models/FavoriteProduct.js");




//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/hoard_db";


var client = new pg.Client(conString);
	//example query de insert 
	client.connect();
	
	var query = client.query("SELECT * FROM useraccount ORDER BY userid");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
		
	query.on("end", function (result) {
								console.log(JSON.stringify(result.rows, null, "    "));
								client.end();
						});
						
		var query = client.query("SELECT * FROM useraccount ORDER BY userid");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
		
	query.on("end", function (result) {
								console.log(JSON.stringify(result.rows, null, "    "));
								client.end();
						});
						
							var query = client.query("SELECT * FROM useraccount ORDER BY userid");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
		
	query.on("end", function (result) {
								console.log(JSON.stringify(result.rows, null, "    "));
								client.end();
						});
						
							var query = client.query("SELECT * FROM useraccount ORDER BY userid");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
		
	query.on("end", function (result) {
								console.log(JSON.stringify(result.rows, null, "    "));
								client.end();
						});
						