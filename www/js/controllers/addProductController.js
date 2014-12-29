hoard.controller('addProductController', function($scope, productService) {
	$scope.pName = "";
	$scope.pLink = "";
	$scope.pCategory = "";
	$scope.pImage = null;
	$scope.categories = [];
	
	productService.getCategories(function(data) {
		console.log(data);
		$scope.categories = data;
	});
	$('select.dropdown')
		.dropdown()
	;
});