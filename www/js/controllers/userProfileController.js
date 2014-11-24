hoard.controller('userProfileController',function($scope, $routeParams, $location, editService, userService) {
	userService.reset();
	//editService.reset();
	
	//State variables
	$scope.userId = $routeParams.id;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	
	$scope.user = null;
	
	$scope.$watch(function() {
					return userService.getUser();
				},
				function() {
					$scope.user = userService.getUser();
				});
	userService.updateUserById($routeParams.id);
	
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