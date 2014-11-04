//Get all users from the DB
exports.users = function(req, res){
		var client =  new pg.Client(conString);
		client.connect();
		result= [];
		var query = client.query("SELECT * FROM userAccount ORDER BY userID");
		query.on("row", function (row, result) {
				result.addRow(row);	
			});
		query.on("end", function(result){
				res.send(result.rows);
			}
		);
};
//Get all products from the DB
//Get all EditRequest from the DB
//Get all FavoriteProducts of a User 
//Get the category product from DB