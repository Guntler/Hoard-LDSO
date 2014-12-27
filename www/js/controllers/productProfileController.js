hoard.controller('productProfileController',function($scope, $routeParams, $location, productService, editService, userService) {
	
	//State variables
	$scope.productId = $routeParams.id;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	$scope.edits = [];
	
	$scope.addedBy = null;
	$scope.product = null;
	$scope.category = null;
	
	productService.getProductById($routeParams.id, function(prod) {
		$scope.product = prod;
		if($scope.product != null) {
						userService.getUserById($scope.product.addedby, function(data) {
							$scope.addedBy = data;
						});
						productService.getCategoryById($scope.product.category, function(data) {
							$scope.category = data;
						});
						editService.getEditCount("Product", $scope.productId, function(data) {
							$scope.totalEdits = data.integer;
						});
						editService.getEditsByPage($routeParams.page,$scope.itemsPerPage, "Product", $scope.productId, function(data) {
							$scope.edits = data;
						});
					}
	});
});