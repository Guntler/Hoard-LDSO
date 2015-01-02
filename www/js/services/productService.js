hoard.service('productService', function ($http, $location, messageService) {

    var categories = function (callback) {
        var Url = "/api/categories/all";
        $http.get(Url).success(function (data) {
            if (data.success == false) {
                if (messageService.getMessages().errorMessage == null)
                    messageService.setError("There has been an unexpected error.");

                callback(null);
            }
            if (data.result.length == 0) {
                if (messageService.getMessages().errorMessage == null)
                    messageService.setError("No categories found.");

                callback(null);
            }
            else {
                callback(data.result);
            }
        }).error(function (data, status, headers, config) {
            messageService.setError("There has been an unexpected error.");
        });
    }

    return {
        addProduct: function (name, link, category, image, imagecontents, callback) {
            var Url = "/api/products/new/";
            var info = {name: name, link: link, image: image, category: category, imagecontents: imagecontents};
            $http.post(Url, info).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
					callback(null);
                }
                else {
					messageService.setSuccess("Your add request has been submitted successfully.");
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {
                messageService.setError("There has been an unexpected error. The product could not be added.");
				callback(null);
            });
        },
        editProduct: function (productid, reason, name, link, image, imagecontents, category, callback) {
            var Url = "/api/editrequests/new/";
			console.log("Image name: " + image);
            var info = {productid: productid, edittype: 'Edit', reason: reason, name: name, link: link, image: image, imagename: image, imagecontents: imagecontents, category: category};
            $http.post(Url, info).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
					callback(null);
                }
                else {
					messageService.setSuccess("Your edit request has been submitted successfully.");
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {
                messageService.setError("There has been an unexpected error. The product could not be added.");
            });
        },
        deleteProduct: function (id, reason, callback) {
            var Url = "/api/editrequests/new/";
            var info = {productid: id, edittype: "Delete", reason: reason};
            $http.post(Url, info).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
					callback(null);
                }
                else {
					messageService.setSuccess("Your delete request has been submitted successfully.");
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {
                messageService.setError("There has been an unexpected error. The product could not be deleted.");
				callback(null);
            });
        },
        getProductsByPage: function (page, productsPerPage, search, callback) {
            var Url = "/api/products/fromTo/" + page + "/" + productsPerPage;
            if (search != undefined && search != null) {
                Url += "?search=" + search;
            }

            $http.get(Url).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
                    callback(null);
                }
                if (data.result.length == 0) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("No products found.");
                    callback(null);
                }
                else {
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {
                messageService.setError("There has been an unexpected error.");
                callback(null);
            });
        },
        getProductById: function (id, callback) {
            var Url = "/api/products/id/" + id;
            $http.get(Url).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
                }
                if (data.result == null) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("Failed to find product.");

                    callback(null);
                }
                else {
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {
                callback(null);
                messageService.setError("There has been an unexpected error.");
            });
        },
        getProductCount: function (search, callback) {
            var Url = "/api/products/count/";
            if (search != undefined && search != null) {
                Url += "?search=" + search;
            }
            $http.get(Url).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
                    callback(null);
                }
                if (data.result == null) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("No products found.");
                    callback(null);
                }
                else {
                    callback({integer: data.result.count});

                }
            }).error(function (data, status, headers, config) {
                messageService.setError("There has been an unexpected error.");
                callback(null);
            });
        },
        getCategoryById: function (id, callback) {
            categories(function (data) {
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].categoryid == id) {
                            callback(data[i]);
                            return;
                        }
                    }
                    callback(null);
                }
            });
        },
        getCategories: categories
    };
});