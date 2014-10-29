var pg = require("pg");
var ProductCategory = require("./models/ProductCategory.js");


//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/HoardDataBase";


var client = new pg.Client(conString);
	
	client.connect();
	
	var query = client.query("SELECT * FROM productCategory ORDER BY categoryID");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
	var productCategorys =[];
	
	query.on("end", function (result) {
							
					
									for(i=0; i<result.rows.length; i++)
				{
				var tempProductCategory = new ProductCategory(
				result.rows[i].categoryid,
				result.rows[i].categoryname
								);
	
				productCategorys.push(tempProductCategory)
				}
						
						console.log(JSON.stringify(productCategorys , null, "     "));  
						client.end();
				});
	

	
	

	