hoard.service('productService',function($http, messageService) {
	var currProducts = [];
	var productCount = {integer: 0};
	var product = null;
	var pcategories = [];
	
	var updateCategories = function() {
		var Url = "/api/categories/all";
		$http.get(Url).success(function(data){
			if(data.result == false) {
				if(messageService.getMessages().errorMessage == null)
					messageService.setError("No categories found.");
			}
			else {
				pcategories = data;
			}
		}).error(function(data,status,headers, config) {
			messageService.setError("There has been an unexpected error.");
		});
	}
	updateCategories();
	
	return {
		reset: function() {
			currProducts = [];
			productCount = {integer: 0};
			product = null;
		},
		updateProductsByPage: function(page, productsPerPage) {
			var Url = "/api/products/fromTo/"+page+"/"+productsPerPage;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No products found.");
				}
				else {
					currProducts = data;
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
			});
		},
		getProduct: function() {
			return product;
		},
		updateProductById: function(id, callback) {			
			var Url = "/api/products/id/"+id;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Failed to find product.");
					
					callback(null);
				}
				else {
					callback(data);
					product = data;
				}
			}).error(function(data,status,headers, config) {
				callback(null);
				messageService.setError("There has been an unexpected error.");
			});
		},
		getCurrProducts: function() {
			return currProducts;
		},
		getProductCount: function() {
			return productCount;
		},
		updateProductCount: function() {
			var Url = "/api/products/count/";
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No products found.");
				}
				else {
					productCount = {integer: data.count};
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
			});
		},
		getCategoryById: function(id) {
			for(var i = 0; i < pcategories.length; i++) {
				if(pcategories[i].id == id)
					return pcategories[i];
			}
			return null;
		}
	};
});