hoard.controller('addProductController', function($scope, $location, productService, messageService) {
	$scope.pName = "";
	$scope.pLink = "";
	$scope.pCategory = "";
	$scope.pImage = null;
	$scope.categories = [];
	$scope.pImageContents = null;
	
	productService.getCategories(function(data) {
		$scope.categories = data;
		$scope.pCategory = $scope.categories[0].categoryid;
	});
	$('select.dropdown')
		.dropdown()
	;
	
	$scope.fileChanged = function(files) {
		$scope.pImage=files[0];
		var read=new FileReader();
		read.readAsBinaryString($scope.pImage);
		$scope.pImageName = $scope.pImage.name;
		read.onloadend=function(){
			$scope.pImageContents = read.result;
			
		};
		
		var reader = new FileReader();
		reader.onload = function (e) {
			$('#productImage')
				.attr('src', e.target.result);
		};
		reader.readAsDataURL($scope.pImage);
		console.log($scope.pImage);
	}
	
	$scope.addProduct = function() {
		if($scope.pLink.indexOf("http://") == -1 && $scope.pLink.indexOf("https://") == -1)
			$scope.pLink = "http://" + $scope.pLink;
		console.log($scope.pImage);
		productService.addProduct($scope.pName, $scope.pLink, $scope.pCategory, $scope.pImage.name, $scope.pImageContents, function(data) {
			if(data) {
				messageService.setSuccess("Your add request has been submitted successfully.");
				$location.url('/home/products/1');
			}
		});
	}
});