hoard.service('productService',function($http) {
	var currProducts = [];
	return {
		getProductsByPage: function(page) {
			var Url = "/api/products/viewProductsFromTo/"+page+"/10";
			$http.get(Url).success(function(data){
				if(data) {
					currProducts = data;
					messageService.setSuccess(data.message[0]);
				}
				else {
					messageService.setError(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				messageService.setError(data.message[0]);
			});
		},
		getProductById: function(id) {			
			
		},
		getCurrProducts: function() {
			return currProducts;
		}
	};
});