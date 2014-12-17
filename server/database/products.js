pg = require("pg");
var Product = require('../models/Product');
var FavoriteProduct = require('../models/FavoriteProduct');
var EditRequests = require('../database/editrequests');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

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

exports.newProduct = function (name, link, category, callback, userid) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = ("INSERT INTO product (name, link, category, visible, addedby) VALUES ($1, $2, $3, 'false', $4", [name, link, category, userid]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded));
        });

        query.on("end", function (result) {
            EditRequests.newRequest(result.rows[0].productid, userid, 'Add', "Added Product", "", [], function (res, err){
                if(err){
                    return callback(err, null);
                } else {
                    done();
                    callback(null, result.rows);
                }
            });
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.getProducts = function (n, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query;

        if (n == null) {
            query = product.query("SELECT * FROM product WHERE visible OFFSET random() * (SELECT COUNT(*) FROM product) LIMIT 5");
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

exports.getProductsFromTo = function (from, to, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product OFFSET $1 LIMIT $2", [(from - 1) * to, to]);

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

exports.getProductCount = function (callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT COUNT (*) FROM product WHERE visible");

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
            var nquery = favorite.query("INSERT INTO favoriteproduct (productid, userid, position) VALUES ($1, $2, $3)", [productid, userid, result.rows[0].count*1+1]);

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
        })


    });
};

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

//remove product from the favorites 
exports.removeProductFromFavorites = function (productid, userID, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("UPDATE favoriteproduct SET visible = 'false' WHERE productid = $1 AND userid = $2", [productid, userID]);
		

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

exports.getSimilarProducts = function (input, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE name LIKE '%' || $1 || '%'", [input]);

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