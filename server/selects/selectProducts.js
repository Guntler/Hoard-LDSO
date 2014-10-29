var pg = require("pg");
var Product = require("./models/Product.js");


//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/HoardDataBase";


var client = new pg.Client(conString);
	
	client.connect();
	
	var query = client.query("SELECT * FROM product ORDER BY productID");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
	var products =[];
	
	query.on("end", function (result) {
							console.log(JSON.stringify(result.rows, null, "    "));
							
									for(i=0; i<result.rows.length; i++)
				{
				var tempProduct = new Product(
				result.rows[i].productid ,
				result.rows[i].name,
				result.rows[i].price,
				result.rows[i].link,
				result.rows[i].imagename,
				result.rows[i].category,
				result.rows[i].visible,
				result.rows[i].addedby,
				result.rows[i].dateadded
												);
	
				products.push(tempProduct)
				}
						
						console.log(JSON.stringify(products, null, "     "));  
						client.end();
				});
	

	
	

	