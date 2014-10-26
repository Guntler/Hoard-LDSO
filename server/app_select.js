//example de query de select
//tabela useraccount

var pg = require("pg");
var UserAccount = require("./models/UserAccount.js");


//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/hoard_db";


var client = new pg.Client(conString);
	//example query de insert 
	client.connect();
	
	var query = client.query("SELECT * FROM userAccount ORDER BY userID");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
	var users =[];
	
	query.on("end", function (result) {
							console.log(JSON.stringify(result.rows, null, "    "));
							
									for(i=0; i<result.rows.length; i++)
				{
				var temp_user = new UserAccount(
				result.rows[i].userid ,
				result.rows[i].email,
				result.rows[i].password,
				result.rows[i].permissions,
				result.rows[i].registerdate,
				result.rows[i].favorites,
				result.rows[i].loggedin
												);
	
				users.push( temp_user )
				}
						
						console.log(JSON.stringify(users, null, "     "));  
						client.end();
				});
	
	
	
	

	