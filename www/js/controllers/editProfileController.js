hoard.controller('editProfileController',function($scope, $routeParams, $location, editService, userService, productService) {
	//editService.reset();
	
	//State variables
	$scope.editId = $routeParams.id;
	
	$scope.edit = null;
	$scope.submitter = null;
	$scope.approvedby = null;
	$scope.product = null;
	
	editService.getEditById($routeParams.id, function(editInfo) {
					$scope.edit = editInfo;
					if($scope.edit != null) {
						userService.getUserById($scope.edit.submittedby, function(sub){
							$scope.submitter = sub;
						});
						
						userService.getUserById($scope.edit.approvedby, function(appr){
								$scope.approvedby = appr;
						});
						
						productService.getProductById($scope.edit.productid, function(prod) {
							$scope.product = prod;
						});
					}
				});
});