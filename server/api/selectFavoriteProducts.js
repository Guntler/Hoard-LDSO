var pg = require("pg");
var FavoriteProduct = require("./models/FavoriteProduct.js");


//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/HoardDataBase";


var client = new pg.Client(conString);
	
	client.connect();
	
	var query = client.query("SELECT * FROM favoriteProduct ORDER BY productID");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
	var favoriteProducts =[];
	
	query.on("end", function (result) {
							console.log(JSON.stringify(result.rows, null, "    "));
							
									for(i=0; i<result.rows.length; i++)
				{
				var tempFavoriteProduct = new FavoriteProduct(
				result.rows[i].productid ,
				result.rows[i].userid,
				result.rows[i].position,
				result.rows[i].visible,
				result.rows[i].lastfavorited
												);
	
				favoriteProducts.push(tempFavoriteProduct)
				}
						
						console.log(JSON.stringify(favoriteProducts, null, "     "));  
						client.end();
				});
	
var Users =  function(){

	this.users =  users;
}

Users.prototype.users =  null;
module.exports =  Users;



	
	

	