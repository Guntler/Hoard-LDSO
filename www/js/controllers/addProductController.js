hoard.controller('addProductController', function($scope, productService) {
	$scope.pName = "";
	$scope.pLink = "";
	$scope.pCategory = "";
	$scope.pImage = null;
	$scope.categories = [];
	
	productService.getCategories(function(data) {
		$scope.categories = data;
	});
});