hoard.service('productService',function($http, $location, messageService) {
	
	var categories = function(callback) {
		var Url = "/api/categories/all";
		$http.get(Url).success(function(data){
			if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
						
					callback(null);
			}
			if(data.result.length == 0) {
				if(messageService.getMessages().errorMessage == null)
					messageService.setError("No categories found.");
					
				callback(null);
			}
			else {
				callback(data.result);
			}
		}).error(function(data,status,headers, config) {
			messageService.setError("There has been an unexpected error.");
		});
	}
	
	return {
			addProduct: function(email,link,category,image) {
				var Url = "/api/products/new/"+name+"/"+link+"/"+category;
				$http.get(Url).success(function(data){
					if(data.success == false) {
						alert("Something happened");
					}
					else {
						alert(data);
						$location.url('/home/products/1');
					}
				}).error(function(data,status,headers, config) {
					messageService.setError("There has been an unexpected error. The product could not be added.");
				});
			},
			getProductsByPage: function(page, productsPerPage, callback) {
				var Url = "/api/products/fromTo/"+page+"/"+productsPerPage;
				$http.get(Url).success(function(data){
					if(data.success == false) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("There has been an unexpected error." );
						callback(null);
					}
					if(data.result.length == 0) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("No products found.");
						callback(null);
					}
					else {
						callback(data.result);
					}
				}).error(function(data,status,headers, config) {
					messageService.setError("There has been an unexpected error.");
					callback(null);
				});
			},
			getProductById: function(id, callback) {			
				var Url = "/api/products/id/"+id;
				$http.get(Url).success(function(data){
					if(data.success == false) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("There has been an unexpected error." );
					}
					if(data.result == null) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("Failed to find product.");
						
						callback(null);
					}
					else {
						callback(data.result);
					}
				}).error(function(data,status,headers, config) {
					callback(null);
					messageService.setError("There has been an unexpected error.");
				});
			},
			getProductCount: function(callback) {
				var Url = "/api/products/count/";
				$http.get(Url).success(function(data){
					if(data.success == false) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("There has been an unexpected error." );
						callback(null);
					}
					if(data.result == null) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("No products found.");
						callback(null);
					}
					else {
						callback({integer: data.result.count});
						
					}
				}).error(function(data,status,headers, config) {
					messageService.setError("There has been an unexpected error.");
					callback(null);
				});
			},
			getCategoryById: function(id, callback) {
				categories(function(data) {
					if(data != null) {
						for(var i = 0; i < data.length; i++) {
							if(data[i].categoryid == id) {
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