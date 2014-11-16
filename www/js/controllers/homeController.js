hoard.controller('homeController',function($scope, $routeParams, $location, productService) {
	$scope.tab = null;
	$scope.currentLocation = null;
	
	if($routeParams.tab === 'products' || $routeParams.tab === 'edits' || $routeParams.tab === 'users') {
		$scope.tab = $routeParams.tab;
		$scope.currentLocation = $scope.tab.charAt(0).toUpperCase() + $scope.tab.slice(1);
	}
	else $location.path('/home/products/1');
	
	$scope.users = [];
	$scope.users.push({name: 'User1', date: 'Sep 14, 2014'});
	$scope.users.push({name: 'User2', date: 'Sep 14, 2014'});
	
	$scope.products = productService.getCurrProducts();
	
	$scope.$watch(function() {
					return productService.getCurrProducts();
				},
				function() {
					$scope.products = productService.getCurrProducts();
				});
	productService.getProductsByPage($routeParams.page);
	//$scope.products.push({name: 'Product1', date: 'Sep 14, 2014'});
	//$scope.products.push({name: 'Product2', date: 'Sep 14, 2014'});
	
	$scope.edits = [];
	$scope.edits.push({name: 'Edit1', date: 'Sep 14, 2014'});
	$scope.edits.push({name: 'Edit2', date: 'Sep 14, 2014'});
	
	$scope.showTab = function(tab) {
		$location.path('/home/'+tab+'/1');
	}
});