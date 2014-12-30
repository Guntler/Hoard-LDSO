hoard.controller('addProductController', function($scope, productService) {
	$scope.pName = "";
	$scope.pLink = "";
	$scope.pCategory = "";
	$scope.pImage = null;
	$scope.categories = [];
	
	productService.getCategories(function(data) {
		$scope.categories = data;
		$scope.pCategory = $scope.categories[0].categoryid;
	});
	$('select.dropdown')
		.dropdown()
	;
	
	$scope.fileChanged = function(files) {
		$scope.pImage=files[0];
		//console.log($scope.pImage);
	}
	
	$scope.addProduct = function() {
		if($scope.pLink.indexOf("http://") == -1 && $scope.pLink.indexOf("https://") == -1)
			$scope.pLink = "http://" + $scope.pLink;
			
		productService.addProduct($scope.pName,$scope.pLink,$scope.pCategory,$scope.pImage.name);
	}
});