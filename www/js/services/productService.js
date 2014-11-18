hoard.service('productService',function($http, messageService) {
	var currProducts = [];
	return {
		getProductsByPage: function(page, productsPerPage) {
			var starting = ((page-1)*productsPerPage)+1;
			var Url = "/api/products/viewProductsFromTo/"+starting+"/"+productsPerPage;
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
		getProductById: function(id) {			
			
		},
		getCurrProducts: function() {
			return currProducts;
		},
		getProductCount: function() {
			var starting = ((page-1)*productsPerPage)+1;
			var Url = "/api/products/viewProductsFromTo/"+starting+"/"+productsPerPage;
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
		}
	};
});