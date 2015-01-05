pg = require("pg");
var Product = require('../models/Product');
var products = require('../database/products');
var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

//Returns a set of products according to the user's favorite products.
//When the user has no favorite products or there are not enough products from a desired category the function returns random products that have not been visualized by the user.
exports.getPreferences = function (userid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        // SELECT Count(product.category) as count, productcategory.categoryid, productcategory.categoryname FROM product, favoriteproduct, productcategory WHERE product.category = productcategory.categoryid AND favoriteproduct.userid = 1 AND favoriteproduct.visible = true AND favoriteproduct.productid = product.productid  AND NOT(EXISTS(SELECT * FROM viewedProducts, product WHERE viewedProducts.productid = product.productId AND viewedProducts.userid = 1))  GROUP BY productcategory.categoryname, productcategory.categoryid

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

//Utility function used for comparing percentage values used in the function above.
function comparePercentages(a,b) {
    if (a.percentage > b.percentage)
        return -1;
    if (a.percentage < b.percentage)
        return 1;
    return 0;
}


