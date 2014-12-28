hoard.controller('userProfileController',function($scope, $routeParams, $location, editService, userService) {
	//editService.reset();
	
	//State variables
	$scope.userId = $routeParams.id;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	$scope.edits = [];
	$scope.permissionSelected = null;
	
	$scope.userProfile = null;
				
	userService.getUserById($routeParams.id, function(data) {
		$scope.userProfile = data;
		if($scope.userProfile != null) {
			$scope.permissionSelected = $scope.userProfile.permissions;
		
			editService.getEditCount("User", $scope.userId, function(data) {
				$scope.totalEdits = data.integer;
			});
			editService.getEditsByPage($routeParams.page,$scope.itemsPerPage, "User", $scope.userId, function(data) {
				$scope.edits = data;
			});
		}
	});
	
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
	
	$scope.setSelectedPermission = function(permission) {
		$scope.permissionSelected = permission;
	}
	
	$scope.changePermissions = function() {
		if($scope.permissionSelected != $scope.userProfile.permissions) {
			userService.changePermissions($scope.userId, $scope.permissionSelected, function(result) {
				$scope.userProfile.permissions = $scope.permissionSelected;
			});
		}
	}
});