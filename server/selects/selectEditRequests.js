var pg = require("pg");
var EditRequest = require("./models/EditRequest.js");


//mudar as credenciais consoante o user que estiverem a ser usados
//neste caso utilizador:postgres; pass: armindo; ip:localhost:5432; nome da db : hoard_db
var conString = "pg://postgres:armindo@localhost:5432/HoardDataBase";


var client = new pg.Client(conString);
	
	client.connect();
	
	var query = client.query("SELECT * FROM editRequest ORDER BY requestID");


	query.on("row", function (row, result) {
						result.addRow(row);
					});
	var editRequests =[];
	
	query.on("end", function (result) {
							console.log(JSON.stringify(result.rows, null, "    "));
							
									for(i=0; i<result.rows.length; i++)
				{
				var tempEditRequest = new EditRequest(
				result.rows[i].requestid,
				result.rows[i].productid,
				result.rows[i].submittedby,
				result.rows[i].approvedby,
				result.rows[i].edittype,
				result.rows[i].editstatus,
				result.rows[i].description,
				result.rows[i].reason,
				result.rows[i].editdate
												);
	
				editRequests.push(tempEditRequest)
				}
						
						console.log(JSON.stringify(editRequests, null, "     "));  
						client.end();
				});
	

	
	

	