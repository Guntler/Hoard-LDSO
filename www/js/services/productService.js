hoard.service('productService',function($http, messageService) {
	var currProducts = [];
	var productCount = {integer: 0};
	var product = null;
	var pcategories = [];
	
	var updateCategories = function() {
		var Url = "/api/categories/all";
		$http.get(Url).success(function(data){
			if(data.result == false) {
				//messageService.setError(data.message[0]);
			}
			else {
				pcategories = data;
				//messageService.setSuccess(data.message[0]);
			}
		}).error(function(data,status,headers, config) {
			//messageService.setError(data.message[0]);
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
					//messageService.setError(data.message[0]);
				}
				else {
					currProducts = data;
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
			});
		},
		getProduct: function() {
			return product;
		},
		updateProductById: function(id) {			
			var Url = "/api/products/id/"+id;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					//messageService.setError(data.message[0]);
				}
				else {
					product = data;
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
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
					//messageService.setError(data.message[0]);
				}
				else {
					productCount = {integer: data.count};
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
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