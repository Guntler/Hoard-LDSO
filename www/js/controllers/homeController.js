hoard.controller('homeController',function($scope, $routeParams, $location, productService, editService, userService, messageService, sessionService) {
	
	//State variables
	$scope.tab = null;
	$scope.currentLocation = null;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalTabItems = 0;
	$scope.filterBy = $routeParams.filterBy;
	$scope.filterVal = $routeParams.filterVal;
	$scope.approved = false;
	$scope.denied = false;
	$scope.pending = false;
	$scope.userFilter = false;
	$scope.adminFilter = false;
	$scope.managerFilter = false;
	$scope.search = $routeParams.search;
	
	var filterVals = [];
	if($scope.filterVal != undefined)
		filterVals = $scope.filterVal.split("|");
	
	for(var i = 0; i < filterVals.length; i++) {
		var val = filterVals[i];
		if(val == "Approved")
			$scope.approved = true;
		else if (val == "Denied")
			$scope.denied = true;
		else if (val == "Pending")
			$scope.pending = true;
		else if (val == "User")
			$scope.userFilter = true;
		else if (val == "Admin")
			$scope.adminFilter = true;
		else if (val == "Manager")
			$scope.managerFilter = true;
	}
	
	messageService.setError(null);
	$scope.$watch(function() {
					return sessionService.getUser();
				},
				function() {
					if(sessionService.getUser() != null) {
						if(sessionService.getUser().permissions != 'Admin' && ($routeParams.tab === 'edits' || $routeParams.tab === 'users'))
							messageService.setError("You don't have the necessary permissions to access this information.");
					}
				});
				
	
	//Tab control
	if($routeParams.tab === 'products' || $routeParams.tab === 'edits' || $routeParams.tab === 'users') {
		$scope.tab = $routeParams.tab;
		$scope.currentLocation = $scope.tab.charAt(0).toUpperCase() + $scope.tab.slice(1);
	}
	else $location.path('/home/products/1');
	
	$scope.showTab = function(tab) {
		if(tab == "edits")
			$location.url('/home/'+ tab+ '/1' + '?filterBy=Status&filterVal=Approved|Denied|Pending');
		else if(tab == "users")
			$location.url('/home/'+ tab+ '/1' + '?filterBy=Permissions&filterVal=User|Admin|Manager');
		else
			$location.url('/home/'+tab+'/1');
	}
	
	//Users
	$scope.users = [];
	if($scope.tab == 'users') {
		userService.getUserCount($scope.filterBy, $scope.filterVal, $scope.search, function(data) {
			$scope.totalTabItems = data.integer;
		});
		
		userService.getUsersByPage($routeParams.page,$scope.itemsPerPage, $scope.filterBy, $scope.filterVal, $scope.search, function(data) {
			$scope.users = data;
		});
		
		$scope.$watch(function() {
					return $scope.userFilter;
				},
				function(newValue, oldValue) {
					if(newValue !== oldValue) {
						var first = true;
						var newFilter = "";
						if($scope.userFilter) {
							newFilter += "User";
							first = false;
						}
						if($scope.adminFilter) {
							if(!first)
								newFilter += "|";
							newFilter += "Admin";
							first = false;
						}
						if($scope.managerFilter) {
							if(!first)
								newFilter += "|";
							newFilter += "Manager";
						}
						
						$scope.filterVal = newFilter;
					}
				});
				
		$scope.$watch(function() {
					return $scope.adminFilter;
				},
				function(newValue, oldValue) {
					if(newValue !== oldValue) {
						var first = true;
						var newFilter = "";
						if($scope.adminFilter) {
							newFilter += "Admin";
							first = false;
						}
						if($scope.userFilter) {
							if(!first)
								newFilter += "|";
							newFilter += "User";
							first = false;
						}
						if($scope.managerFilter) {
							if(!first)
								newFilter += "|";
							newFilter += "Manager";
						}
						
						$scope.filterVal = newFilter;
					}
				});
				
		$scope.$watch(function() {
					return $scope.managerFilter;
				},
				function(newValue, oldValue) {
					if(newValue !== oldValue) {
						var first = true;
						var newFilter = "";
						if($scope.managerFilter) {
							newFilter += "Manager";
							first = false;
						}
						if($scope.adminFilter) {
							if(!first)
								newFilter += "|";
							newFilter += "Admin";
							first = false;
						}
						if($scope.userFilter) {
							if(!first)
								newFilter += "|";
							newFilter += "User";
						}
						
						$scope.filterVal = newFilter;
					}
				});
			
		$scope.$watch(function() {
					return $scope.filterVal;
				},
				function(newValue, oldValue) {
					if(newValue != oldValue)
						$location.url('/home/users/1?filterBy=Permissions&filterVal=' + $scope.filterVal);
				});
	}
		

	//Products
	$scope.productToDelete = null;
	$scope.reasonToDelete = "";
	$scope.products = [];
	if($scope.tab == 'products') {
		productService.getProductCount($scope.search, function(data) {
			$scope.totalTabItems = data.integer;
		});
		
		productService.getProductsByPage($routeParams.page,$scope.itemsPerPage, $scope.search, function(data) {
			$scope.products = data;
		});
	}
	
	/*$scope.showDeleteModal =  function(id) {
		$scope.productToDelete = id;
		$('.modal.delete-modal').modal('show');
	}*/
	
	$scope.deleteProduct = function(id) {
		productService.deleteProduct(id, "Delete product.", function() {});
	}
	
	//Edits
	$scope.edits = [];
	if ($scope.tab == 'edits') {
		editService.getEditCount($scope.filterBy, $scope.filterVal, function(data) {
			$scope.totalTabItems = data.integer;
		});
		
		editService.getEditsByPage($routeParams.page,$scope.itemsPerPage, $scope.filterBy, $scope.filterVal, function(data) {
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
				function(newValue, oldValue) {
					if(newValue != oldValue)
						$location.url('/home/edits/1?filterBy=Status&filterVal=' + $scope.filterVal);
				});
	}
	
	$scope.approveEdit = function(edit) {
		if(edit.editstatus == "Pending")
			editService.resolveEdit(edit.id, true, function(result) {
				if(result)
					edit.editstatus = "Approved";
			});
	}
	
	$scope.rejectEdit = function(edit) {
		if(edit.editstatus == "Pending")
		editService.resolveEdit(edit.id, false, function(result) {
			if(result)
				edit.editstatus = "Denied";
		});
	}
	
	$scope.executeSearch = function() {
		if($scope.tab == "users")
			$location.url('/home/users/1?filterBy=Permissions&filterVal=' + $scope.filterVal + '&search=' + $scope.search);
		else if ($scope.tab = "products")
			$location.url('/home/products/1?search=' + $scope.search);
	}
});