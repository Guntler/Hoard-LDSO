hoard.controller('homeController',function($scope, $routeParams, $location, productService, editService, userService, messageService, sessionService) {
	
	//State variables
	$scope.tab = null;
	$scope.currentLocation = null;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalTabItems = 0;
	$scope.errorMessage = null;
	$scope.filterBy = $routeParams.filterBy;
	$scope.filterVal = $routeParams.value;
	
	messageService.clearAll();
	$scope.$watch(function() {
					return sessionService.getUser();
				},
				function() {
					if(sessionService.getUser() != null) {
						if(sessionService.getUser().permissions != 'Admin' && ($routeParams.tab === 'edits' || $routeParams.tab === 'users'))
							messageService.setError("You don't have the necessary permissions to access this information.");
					}
				});
	
	$scope.$watch(function() {
					return messageService.getMessages().errorMessage;
				},
				function() {
					$scope.errorMessage = messageService.getMessages().errorMessage;
				});
				
	
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
		
		userService.getUserCount(function(data) {
			$scope.totalTabItems = data.integer;
		});
		
		userService.getUsersByPage($routeParams.page,$scope.itemsPerPage, function(data) {
			$scope.users = data;
		});
	}
		

	//Products
	$scope.products = [];
	if($scope.tab == 'products') {
		productService.getProductCount(function(data) {
			$scope.totalTabItems = data.integer;
		});
		
		productService.getProductsByPage($routeParams.page,$scope.itemsPerPage, function(data) {
			$scope.products = data;
		});
	}
	
	//Edits
	$scope.edits = [];
	
	if ($scope.tab == 'edits') {
		
		editService.getEditCount($scope.filterBy, $scope.filterVal, function(data) {
			$scope.totalTabItems = data.integer;
		});
		
		editService.getEditsByPage($routeParams.page,$scope.itemsPerPage, $scope.filterBy, $scope.filterVal, 
			function(data) {
				$scope.edits = data;
			});
			
		$scope.$watch(function() {
					return $scope.filterVal;
				},
				function() {
					$location.search('filterBy','Status');
					$location.search('filterVal',$scope.filterVal);
					$location.path('/home/edits/1');
				});
	}
});