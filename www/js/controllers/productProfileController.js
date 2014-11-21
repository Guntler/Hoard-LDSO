hoard.controller('productProfileController',function($scope, $routeParams, $location, productService, editService, userService) {
	productService.reset();
	userService.reset();
	//State variables
	$scope.productId = $routeParams.id;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	
	$scope.product = null;
	$scope.category = null;
	$scope.$watch(function() {
					return productService.getProduct();
				},
				function() {
					$scope.product = productService.getProduct();
					if($scope.product != null) {
						userService.updateUserById($scope.product.addedby);
						$scope.category = productService.getCategoryById($scope.product.category);
					}
				});
	productService.updateProductById($routeParams.id);
	
	$scope.addedBy = null;
	$scope.$watch(function() {
					return userService.getUser();
				},
				function() {
					$scope.addedBy = userService.getUser();
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