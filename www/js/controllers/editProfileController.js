hoard.controller('editProfileController',function($scope, $routeParams, $location, editService, userService, productService) {
	//editService.reset();
	
	//State variables
	$scope.editId = $routeParams.id;
	
	$scope.edit = null;
	$scope.submitter = null;
	$scope.approvedby = null;
	$scope.product = null;
	$scope.productCategory = "";
	
	editService.getEditById($routeParams.id, function(editInfo) {
		$scope.edit = editInfo;
		if($scope.edit != null) {
			userService.getUserById($scope.edit.submittedby, function(sub){
				$scope.submitter = sub;
			});
			
			if($scope.edit.approvedby != undefined && $scope.edit.approvedby != null) {
				userService.getUserById($scope.edit.approvedby, function(appr){
						$scope.approvedby = appr;
				});
			}
			
			productService.getProductById($scope.edit.productid, function(prod) {
				$scope.product = prod;
				productService.getCategoryById(prod.category, function (data) {
					var category = data.categoryid - 1;
					productService.getCategories(function (result) {
						$scope.categories = result;
						$scope.productCategory = $scope.categories[category].name;
					});
				});
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
});