hoard.controller('productProfileController',function($scope, $routeParams, $location, productService, editService, userService) {
	
	//State variables
	$scope.productId = $routeParams.id;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	$scope.edits = [];
	//$scope.reasonToDelete = "";
	
	$scope.addedBy = null;
	$scope.product = null;
	$scope.category = null;
	
	productService.getProductById($routeParams.id, function(prod) {
		$scope.product = prod;
		if($scope.product != null) {
						userService.getUserById($scope.product.addedby, function(data) {
							$scope.addedBy = data;
						});
						productService.getCategoryById($scope.product.category, function(data) {
							$scope.category = data;
						});
						editService.getEditCount("Product", $scope.productId, function(data) {
							$scope.totalEdits = data.integer;
						});
						editService.getEditsByPage($routeParams.page,$scope.itemsPerPage, "Product", $scope.productId, function(data) {
							$scope.edits = data;
						});
					}
	});
	
	$scope.goToEdit = function() {
		$location.url("/products/actions/edit/"+$scope.productId);
	}
	
	$scope.approveEdit = function(edit) {
		if(edit.editstatus == "Pending")
		editService.resolveEdit(edit.id, true, function(result) {
			if(result)
				edit.editstatus = "Approved";
		});
	}
	
	/*$scope.showDeleteModal =  function() {
		$('.modal.delete-modal').modal('show');
	}*/
	
	$scope.deleteProduct = function() {
		productService.deleteProduct($scope.productId, "Delete product.", function() {});
	}
	
	$scope.rejectEdit = function(edit) {
		if(edit.editstatus == "Pending")
		editService.resolveEdit(edit.id, false, function(result) {
			if(result)
				edit.editstatus = "Denied";
		});
	}
});