hoard.controller('userProfileController',function($scope, $routeParams, $location, editService, userService) {
	//editService.reset();
	
	//State variables
	$scope.userId = $routeParams.id;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	$scope.edits = [];
	
	$scope.userProfile = null;
				
	userService.getUserById($routeParams.id, function(data) {
		$scope.userProfile = data;
		if($scope.userProfile != null) {
						editService.getEditCount("User", $scope.userId, function(data) {
							$scope.totalEdits = data.integer;
						});
						editService.getEditsByPage($routeParams.page,$scope.itemsPerPage, "User", $scope.userId, function(data) {
							$scope.edits = data;
						});
					}
	});
});