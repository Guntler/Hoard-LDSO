hoard.controller('userProfileController',function($scope, $routeParams, $location, editService, userService) {
	userService.reset();
	//editService.reset();
	
	//State variables
	$scope.userId = $routeParams.id;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	
	$scope.user = null;
				
	userService.updateUserById($routeParams.id, function(data) {
		$scope.user = data;
	});
	
	//Edits
	$scope.edits = [];
	
	$( ".ui.checkbox" ).checkbox();
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