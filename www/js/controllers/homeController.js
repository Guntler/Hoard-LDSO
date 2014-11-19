hoard.controller('homeController',function($scope, $routeParams, $location, productService, editService, userService) {
	
	//State variables
	$scope.tab = null;
	$scope.currentLocation = null;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalTabItems = 0;
	
	//Tab control
	if($routeParams.tab === 'products' || $routeParams.tab === 'edits' || $routeParams.tab === 'users') {
		$scope.tab = $routeParams.tab;
		$scope.currentLocation = $scope.tab.charAt(0).toUpperCase() + $scope.tab.slice(1);
	}
	else $location.path('/home/products/1');
	
	$scope.showTab = function(tab) {
		$location.path('/home/'+tab+'/1');
	}
	
	//Users
	$scope.users = [];
	
	if($scope.tab == 'users') {
		$scope.$watch(function() {
					return userService.getUserCount();
				},
				function() {
					$scope.totalTabItems = userService.getUserCount().integer;
				});
		userService.updateUserCount();
	}
		
	$scope.$watch(function() {
					return userService.getCurrUsers();
				},
				function() {
					$scope.users = userService.getCurrUsers();
				});
	userService.updateUsersByPage($routeParams.page,$scope.itemsPerPage);
	
	//Products
	$scope.products = [];
	if($scope.tab == 'products') {
		$scope.$watch(function() {
					return productService.getProductCount();
				},
				function() {
					$scope.totalTabItems = productService.getProductCount().integer;
				});
		productService.updateProductCount();
	}
		
	$scope.$watch(function() {
					return productService.getCurrProducts();
				},
				function() {
					$scope.products = productService.getCurrProducts();
				});
	productService.updateProductsByPage($routeParams.page,$scope.itemsPerPage);
	
	//Edits
	$scope.edits = [];
	
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
	editService.updateEditsByPage($routeParams.page,$scope.itemsPerPage);
});