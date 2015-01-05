pg = require("pg");
var Product = require('../models/Product');
var FavoriteProduct = require('../models/FavoriteProduct');
var EditRequests = require('../database/editrequests');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

// Returns a product given its id.
exports.findById = function (id, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE productId = $1", [id]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            done();
            if (result.rows.length < 1)
                callback(null, null);
            else
                callback(null, result.rows[0]);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Inserts a new product.
exports.newProduct = function (name, link, imagename, category, imagecontents, userid,callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }
		
		var query = product.query("INSERT INTO product (name, link, imagename, category, visible, addedby) VALUES ($1, $2, $3, $4, 'false', $5) RETURNING *", [name, link, imagename, category, userid]);
        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });
		
        query.on("end", function (result) {
            EditRequests.newRequest(result.rows[0].id, userid, 'Add', "Added Product", null, null,null,imagename,imagecontents,null, function (err2, res){
                if(err2){
                    return callback(err2, null);
                } else {
                    done();
                    callback(null, res);
                }
            });
        });

        query.on("error", function (err4) {
            done();
            callback(err4, null);
        });
    });
};

// Returns 5 random products or n random products if n is given.
exports.getProducts = function (n, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query;

        if (n == null) {
            //query = product.query("SELECT * FROM product WHERE visible OFFSET random() * (SELECT COUNT(*) FROM product) LIMIT 5");
            query = product.query("SELECT * FROM PRODUCT WHERE visible ORDER BY random() LIMIT 5");
        } else {
            query = product.query("SELECT * FROM product WHERE visible OFFSET random() * (SELECT COUNT(*) FROM product) LIMIT $1", [n]);
        }

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Returns an interval of products for pagination purposes.
exports.getProductsFromTo = function (from, to, search, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

		var queryStr = "SELECT * FROM product WHERE";
		var currArg = 1;
		var arr = [];
		
		if(search != undefined && search != null) {
			queryStr += " similarity(name, $1) > 0.1 AND";
			currArg++;
			arr = [search];
		}
	
		queryStr +=  " visible = true OFFSET $" + currArg + " LIMIT $" + (currArg+1);
		
		arr = arr.concat([(from - 1) * to, to]);
        var query = product.query(queryStr, arr);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Returns all products.
exports.getAllProducts = function (callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE visible ORDER BY name");

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Retuns the total number of products, allowing to filter by name.
exports.getProductCount = function (search, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }
		
		var queryStr = "SELECT COUNT(*) FROM product WHERE";
		var currArg = 1;
		var arr = [];
		
		if(search != undefined && search != null) {
			queryStr += " similarity(name, $1) > 0.2 AND";
			currArg++;
			arr = [search];
		}
			
		queryStr +=  " visible = true";
		var query;
		
		if(arr != [])
			query = product.query(queryStr, arr);
		else
			query = product.query(queryStr);

        query.on("row", function (row) {
            done();
            callback(null, row);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Adds a product to a user's favorite list.
exports.addToFavorites = function (productid, userid, callback) {
    pg.connect(conString, function (err, favorite, done)  {
        if (err) {
            return callback(err, null);
        }

        var query = favorite.query("SELECT COUNT (*) FROM favoriteproduct WHERE userid = $1", [userid]);
        

		query.on("row", function (row, result) {
			result.addRow(row);
		});

		query.on("end", function (result) {
			var exists = favorite.query("SELECT EXISTS(SELECT 1 FROM favoriteproduct WHERE userid = $1 AND productid = $2)", [userid, productid]);
			exists.on("row", function (row, result) {
				result.addRow(row);
			});
			
			exists.on("end", function (favoriteResult) {
				console.log(favoriteResult.rows);
				if(favoriteResult.rows[0].exists == true) {
					var updateQuery = favorite.query("UPDATE favoriteproduct SET visible = TRUE, lastfavorited = NOW() WHERE productid = $1 AND userid = $2", [productid, userid]);

					updateQuery.on("end", function (result) {
						done();
						callback(null, result);
					});

					updateQuery.on("error", function (err) {
						done();
						callback(err, null);
					});
				}
				else {
					var nquery = favorite.query("INSERT INTO favoriteproduct (productid, userid, position) VALUES ($1, $2, $3)", [productid, userid, result.rows[0].count+1]);

					nquery.on("row", function (row, result) {
						result.addRow(new FavoriteProduct(row.productid, row.userid, row.position, row.visible, row.lastfavorited));
					});

					nquery.on("end", function (result) {
						done();
						callback(null, result);
					});

					nquery.on("error", function (err) {
						done();
						callback(err, null);
					});
				}
			});
			
			exists.on("error", function(err) {
				callback(err, null);
			});
		});
		
		query.on("error", function(err) {
			callback(err, null);
		});
    });
};

// Removes a product, effectively making it invisible but keeping in the db.
exports.removeProduct = function (productid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("UPDATE product SET visible = 'false' WHERE productid = $1", [productid]);

        query.on("row", function (row) {
            done();
            callback(null, row);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Remove product from the favorites.
exports.removeProductFromFavorites = function (productid, userID, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("UPDATE favoriteproduct SET visible = 'false' WHERE productid = $1 AND userid = $2", [productid, userID]);
		

        query.on("end", function (result) {
            done();
            callback(null, result);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Returns a user's favorite products, given the user id.
exports.getFavorites = function (userid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }
        var query;
            query = product.query("SELECT * FROM favoriteproduct NATURAL JOIN product WHERE userid = $1 AND visible", [userid]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Returns products with a given field similar to a users input. Ex: given a product name, gets products with a similar name.
exports.getSimilarFieldProducts = function (field, input, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query;

        if(field == "name")
            query = product.query("SELECT * FROM product WHERE similarity(name, $1) > 0.1", [input]);
        else if (field == "category")
            query = product.query("SELECT * FROM product, productcategory WHERE similarity(productcategory.categoryname, $1) > 0.2 AND productcategory.categoryid = product.category", [input]);
        else
            return callback(err, null);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Moves a favorite up in the favorite list.
exports.favoriteUp = function (userid, productid, callback)
{
   pg.connect(conString, function (err, favoriteproduct, done) {
            if (err) {
                return callback(err, null);
            }

            var query1 = favoriteproduct.query("SELECT * FROM favoriteproduct WHERE productid = $1 AND userid=$2", [productid, userid]);

            query1.on("row", function (row, result) {
                result.addRow(new FavoriteProduct(row.productid, row.userid, row.position, row.visible, row.lastfavorited));
			
			
            });

            query1.on("end", function (result) {
                var resultData = result.rows[0];

                if (result.rows.length < 1) {
                    done();
                    callback(err, null);
                } 
				else if(resultData.position==1)
				{
				
				done();
				callback(null, {result : 'Already the first position'});
				}
				else {
					var newPosition = resultData.position -1; 
                    var query2 = favoriteproduct.query("UPDATE favoriteproduct SET position=$1 WHERE position =$2 AND userid=$3", [resultData.position , newPosition,  userid]);
					
                    query2.on("end", function (result) {
								
							var newPosition1 = resultData.position -1;		
                            var query3 = favoriteproduct.query("UPDATE favoriteproduct SET position=$1 WHERE userid=$2 AND productid=$3", [newPosition1,  userid, productid]);

                            query3.on("error", function (err) {
                                done();
                                callback(err, null);
							
                            });
	
                            query3.on("end", function (result) {
                                done();	
                                callback(null, {result : true});
                            });
                       
					   });

                    query2.on("error", function (err) {
                        done();
                        callback(err, null);
                    });
                }
            });
        }
    );


};

// Moves a favorite down in the favorite list.
exports.favoriteDown = function (userid, productid, callback)
{
   pg.connect(conString, function (err, favoriteproduct, done) {
            if (err) {
                return callback(err, null);
            }

            var query1 = favoriteproduct.query("SELECT * FROM favoriteproduct WHERE userid=$1", [userid]);

            query1.on("row", function (row, result) {
                result.addRow(new FavoriteProduct(row.productid, row.userid, row.position, row.visible, row.lastfavorited));
			
			
            });

            query1.on("end", function (result) {
                var resultData;
					for(var i = 0; i < result.rows.length; i++)
					{
						if(userid == result.rows[i].user && productid == result.rows[i].product)
						{
							resultData = result.rows[i];
						
						
						}
					}
				
                if (result.rows.length < 1) {
                    done();
                    callback(err, null);
                } 
				
				else if(resultData.position == result.rows.length )
				{
				
				done();
				callback(null, {result : 'Already the last position'});
				}
				else {
					var newPosition = resultData.position +1; 
                    var query2 = favoriteproduct.query("UPDATE favoriteproduct SET position=$1 WHERE position =$2 AND userid=$3", [resultData.position , newPosition,  userid]);
					
                    query2.on("end", function (result) {
								
							var newPosition1 = resultData.position +1;		
                            var query3 = favoriteproduct.query("UPDATE favoriteproduct SET position=$1 WHERE userid=$2 AND productid=$3", [newPosition1,  userid, productid]);

                            query3.on("error", function (err) {
                                done();
                                callback(err, null);
							
                            });
	
                            query3.on("end", function (result) {
                                done();	
                                callback(null, {result:true});
                            });
                       
					   });

                    query2.on("error", function (err) {
                        done();
                        callback(err, null);
                    });
                }
            });
        }
    );
};

// Returns n (or less) products from a given category, that have not been seen by the specified user, used in preferences algorithm.
exports.getNProductsFromCat = function (userid, category, nproducts, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE category = $1 AND NOT(EXISTS(SELECT * FROM viewedProducts, product WHERE viewedProducts.productid = product.productid AND viewedProducts.userid = $2)) LIMIT $3", [category, userid, nproducts]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

// Returns n (or less) products, that have not been seen by the specified user, used in preferences algorithm.
exports.getNNewProducts = function (userid, nproducts, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE NOT(EXISTS(SELECT * FROM viewedProducts, product WHERE viewedProducts.productid = product.productid AND viewedProducts.userid = $1)) LIMIT $2", [userid, nproducts]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

//Resets the users viewedProducts and returns some products, used in preferences algorithm.
exports.resetViewedProducts  = function (userid, nProductsToReturn, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query1 = product.query("DELETE FROM viewedProducts WHERE userid = $1", [userid]);

        query1.on("row", function (row) {
            done();
        });

        query1.on("error", function (err) {
            done();
            callback(err, null);
        });

        if(nProductsToReturn > 0 ){
            var query2 = product.query("SELECT * FROM product LIMIT $1", [nProductsToReturn]);

            query2.on("row", function (row, result) {
                result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
            });

            query2.on("end", function (result) {
                done();
                callback(null, result.rows);
            });

            query2.on("error", function (err) {
                done();
                callback(err, null);
            });
        }
        else{
            callback(null, []);
        }
    });
};

//Adds a entry to the viewedProducts table.
exports.addViewedProduct = function (userid, productid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("INSERT INTO viewedProducts (productid, userid) VALUES ($1, $2)", [productid, userid]);

        query.on("row", function (row, result) {
            done();
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};