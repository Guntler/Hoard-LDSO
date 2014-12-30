hoard.controller('productEditController',function($scope, $routeParams, $location, productService, editService, userService) {
	
	//State variables
	$scope.productId = $routeParams.id;
	$scope.currentPage = $routeParams.page;
	$scope.itemsPerPage = 10;
	$scope.pageRange = 3;
	$scope.totalEdits = 0;
	$scope.edits = [];
	
	$scope.addedBy = null;
	$scope.product = null;
	$scope.category = null;

	$scope.newName = null;
	$scope.reason = null;
	$scope.newLink = null;
	$scope.newImageName = null;

	$scope.editProduct = function(productid, reason, name, link, imageName, category) {
		productService.editProduct(productid, reason, name, link, imageName, category, function(result){
			if(result)
				$location.path('home/products/1');
		})
	};

	productService.getProductById($routeParams.id, function(prod) {
		$scope.product = prod;

		if($scope.product != null) {
						userService.getUserById($scope.product.addedby, function(data) {
							$scope.addedBy = data;
						});
						productService.getCategoryById($scope.product.category, function(data) {
							$scope.category = data;
						});
					}
	});

	productService.getCategories(function(result) {
		$scope.categories = result;
		$scope.newCategory = "";
	});
	
	$scope.approveEdit = function(edit) {
		if(edit.editstatus == "Pending")
		editService.resolveEdit(edit.id, true, function(result) {
			if(result)
				edit.editstatus = "Approved";
		});
	};
	
	$scope.rejectEdit = function(edit) {
		if(edit.editstatus == "Pending")
		editService.resolveEdit(edit.id, false, function(result) {
			if(result)
				edit.editstatus = "Denied";
		});
	}
});