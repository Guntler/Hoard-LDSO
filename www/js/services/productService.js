hoard.service('productService',function($http, messageService) {
	var currProducts = [];
	var productCount = {integer: 0};
	return {
		updateProductsByPage: function(page, productsPerPage) {
			var Url = "/api/products/fromTo/"+page+"/"+productsPerPage;
			console.log(Url);
			$http.get(Url).success(function(data){
				if(data.result == false) {
					//messageService.setError(data.message[0]);
				}
				else {
					currProducts = data;
					console.log(data);
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
			});
		},
		getProductById: function(id) {			
			
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
		}
	};
});