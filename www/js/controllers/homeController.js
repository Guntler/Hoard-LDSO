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
	$scope.filterVal = $routeParams.filterVal;
	$scope.approved = false;
	$scope.denied = false;
	$scope.pending = false;
	
	var filterVals = [];
	if($scope.filterVals != undefined)
		filterVals = $scope.filterVal.split("|");
	for(val in filterVals) {
		console.log(val);
		if(val == "Approved") {
			$scope.approved = true;
			console.log("approved: " +  $scope.approved);
		}
		else if (val == "Denied")
			$scope.denied = true;
		else if (val == "Pending")
			$scope.pending = true;
	}
	
	console.log($scope.approved);
	
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
		if(tab == "edits") {
			$location.url('/home/'+ tab+ '/1' + '?filterBy=Status&filterVal=Approved|Denied|Pending');
		}
		else
			$location.url('/home/'+tab+'/1');
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
					return $scope.approved;
				},
				function(newValue, oldValue) {
					if(newValue !== oldValue) {
						var first = true;
						var newFilter = "";
						if($scope.approved) {
							newFilter += "Approved";
							first = false;
						}
						if($scope.denied) {
							if(!first)
								newFilter += "|";
							newFilter += "Denied";
							first = false;
						}
						if($scope.pending) {
							if(!first)
								newFilter += "|";
							newFilter += "Pending";
						}
						
						$scope.filterVal = newFilter;
					}
				});
				
		$scope.$watch(function() {
					return $scope.denied;
				},
				function(newValue, oldValue) {
					if(newValue !== oldValue) {
						var first = true;
						var newFilter = "";
						if($scope.approved) {
							newFilter += "Approved";
							first = false;
						}
						if($scope.denied) {
							if(!first)
								newFilter += "|";
							newFilter += "Denied";
							first = false;
						}
						if($scope.pending) {
							if(!first)
								newFilter += "|";
							newFilter += "Pending";
						}
						
						$scope.filterVal = newFilter;
					}
				});
				
		$scope.$watch(function() {
					return $scope.pending;
				},
				function(newValue, oldValue) {
					if(newValue !== oldValue) {
						var first = true;
						var newFilter = "";
						if($scope.approved) {
							newFilter += "Approved";
							first = false;
						}
						if($scope.denied) {
							if(!first)
								newFilter += "|";
							newFilter += "Denied";
							first = false;
						}
						if($scope.pending) {
							if(!first)
								newFilter += "|";
							newFilter += "Pending";
						}
						
						$scope.filterVal = newFilter;
					}
				});
			
		$scope.$watch(function() {
					return $scope.filterVal;
				},
				function() {
					$location.url('/home/edits/1?filterBy=Status&filterVal=' + $scope.filterVal);
				});
	}
});