hoard.controller('homeController',function($scope, $routeParams, $location, productService) {
	
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
	$scope.users.push({name: 'User1', date: 'Sep 14, 2014'});
	$scope.users.push({name: 'User2', date: 'Sep 14, 2014'});
	
	//Products
	$scope.products = productService.getCurrProducts();
	$scope.$watch(function() {
					return productService.getCurrProducts();
				},
				function() {
					$scope.products = productService.getCurrProducts();
					$scope.totalTabItems = $scope.products.length;
				});
	productService.getProductsByPage($routeParams.page,$scope.itemsPerPage);
	
	//Edits
	$scope.edits = [];
	$scope.edits.push({name: 'Edit1', date: 'Sep 14, 2014'});
	$scope.edits.push({name: 'Edit2', date: 'Sep 14, 2014'});
	
});