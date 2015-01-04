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

exports.getProductsFromTo = function (from, to, search, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

		var queryStr = "SELECT * FROM product WHERE";
		var currArg = 1;
		var arr = [];
		
		if(search != undefined && search != null) {
			queryStr += " similarity(name, $1) > 0.1 AND"
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

exports.getProductCount = function (search, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }
		
		var queryStr = "SELECT COUNT(*) FROM product WHERE";
		var currArg = 1;
		var arr = [];
		
		if(search != undefined && search != null) {
			queryStr += " similarity(name, $1) > 0.2 AND"
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

exports.getSimilarFieldProducts = function (field, input, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        if(field == "name")
            var query = product.query("SELECT * FROM product WHERE similarity(name, $1) > 0.1", [input]);
        else if (field == "category")
            var query = product.query("SELECT * FROM product, productcategory WHERE similarity(productcategory.categoryname, $1) > 0.2 AND productcategory.categoryid = product.category", [input]);
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

exports.getPreferences = function (userid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        //Get the number of favoriteproducts in each product category
        var query = product.query("SELECT Count(product.category) as count, productcategory.categoryid, productcategory.categoryname FROM product, favoriteproduct, productcategory WHERE product.category = productcategory.categoryid AND favoriteproduct.userid = $1 AND favoriteproduct.visible = true AND favoriteproduct.productid = product.productid GROUP BY productcategory.categoryname, productcategory.categoryid", [userid]);
        var counter = 0;
        var nProducts = 0;

        query.on("row", function (row, result) {
            result.addRow(row);
            console.log("This is row" +counter + ":" + JSON.stringify(result.rows[counter]));
            nProducts += parseInt(result.rows[counter].count);
            counter++;
        });


        query.on("end", function (result) {
            done();
            if (result.rows.length < 1) {
                //RETORNAR CENAS ALEATORIAS
                callback(null, null);
            }
            else{
                console.log("Total products = " + nProducts);

                //Array with the percentages of each category on the user's favoriteprodutcs
                var percentageArray = [];

                for(i = 0; i < result.rows.length; i++){

                    var percent = result.rows[i].count/nProducts;
                    var element = {catname: result.rows[i].categoryname, catid: result.rows[i].categoryid, percentage : percent};
                    percentageArray[i] = element;
                }

                percentageArray.sort(comparePercentages);

                console.log("Printing: percentageArray");
                console.log(JSON.stringify(percentageArray));

                //Make the percentages correspond to a int number of products.
                var sum = 0;
                var numProductsArray = [];
                var productsToReturn = 10;

                for(j = 0; j < percentageArray.length; j++) {
                    var rounded = Math.round( percentageArray[j].percentage * 10 ) / 10;
                    rounded *= 10;

                    var difference = sum + rounded - productsToReturn;
                    var testSum = sum + rounded;

                    if(testSum > productsToReturn){
                        console.log("Sum(" + sum + ") exceeded nProducts, subtracting " + difference + " from current product.");
                        rounded -= difference;
                    }

                    sum += rounded;

                    var numProduct = {cat: percentageArray[j].catid, num: rounded};
                    console.log("Added numProduct:" + JSON.stringify(numProduct));
                    numProductsArray[numProductsArray.length] = numProduct;
                }

                console.log("Printing: numProductsArray");
                console.log(JSON.stringify(numProductsArray));

                var productsToReturn = [];
                var randomProducts = 0;
                var counter = 0;

                for(k = 0; k < numProductsArray.length; k++) {
                    console.log("Iterations:" + k);

                    var number = numProductsArray[k].num;

                    products.getNProductsFromCat(numProductsArray[k].cat, numProductsArray[k].num, function (err, result) {
                        if(counter >= k-1){
                            //console.log("LAST PRINT:");
                            //console.log(JSON.stringify(productsToReturn));

                            if(randomProducts > 0) {
                                products.getNNewProducts(randomProducts, function (errr, res) {
                                    if (errr) {
                                        console.log("Failed on getting random products.");
                                        callback(err, null);
                                    }
                                    else if (res) {
                                        var diff = randomProducts - res.length;
                                        if (diff > 0) {
                                            //reset products
                                        }
                                        productsToReturn = productsToReturn.concat(result);
                                        callback(null, productsToReturn);
                                    }
                                });
                            }
                            else{
                                callback(null, productsToReturn);
                            }
                        }
                        else {
                            counter++;
                        }

                        if (err) {
                            console.log("Failed on getting products from categories.");
                            callback(err, null);
                        }
                        else if (result) {
                            var difference = number - result.length;
                            if(difference > 0) {
                                console.log("Added "+ difference + "to randomProducts");
                                randomProducts += difference;
                            }
                            productsToReturn = productsToReturn.concat(result);
                        }
                    });
                }
            }
        });
    });
};

function comparePercentages(a,b) {
    if (a.percentage > b.percentage)
        return -1;
    if (a.percentage < b.percentage)
        return 1;
    return 0;
}

exports.getNProductsFromCat = function (category, nproducts, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE category = $1 LIMIT $2", [category, nproducts]);

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

exports.getNNewProducts = function (nproducts, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product LIMIT $1", [nproducts]);

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

