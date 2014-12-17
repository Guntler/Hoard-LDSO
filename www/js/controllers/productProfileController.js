hoard.controller('productProfileController',function($scope, $routeParams, $location, productService, editService, userService) {
	
	//State variables
	$scope.productId = $routeParams.id;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	
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
					}
	});
				
	//Edits
	$scope.edits = [];
	/*
	if ($scope.tab == 'edits') {
		$scope.$watch(function() {
					return editService.getEditCount();
				},
				function() {
					$scope.totalTabItems = editService.getEditCount().integer;
				});
		editService.updateEditCount();
	}
	
	$scope.$watch(function() {
					return editService.getCurrEdits();
				},
				function() {
					$scope.edits = editService.getCurrEdits();
				});
	editService.updateEditsByPage($routeParams.page,$scope.itemsPerPage);*/
});