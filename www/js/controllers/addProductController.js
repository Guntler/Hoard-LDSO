hoard.controller('addProductController', function($scope, $location, productService, messageService) {
	$scope.pName = "";
	$scope.pLink = "";
	$scope.pCategory = "";
	$scope.pImage = null;
	$scope.categories = [];
	$scope.pImageContents = null;
	$scope.linkError = false;
	
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
	}
	
	$scope.addProduct = function() {
		var re = /^http\:\/\/www\.|https\:\/\/www\.|www\../i;
		
		if ($scope.pName != null && $scope.pName != undefined && $scope.pName != "") {
            messageService.clearAll();
            $scope.linkError = false;
			
            if ($scope.pName.length > 3) {
				if ($scope.pLink.match(re)) {
						if($scope.pImageName != "" && $scope.pImageName != null && $scope.pImageName != undefined) {
						
						if($scope.pLink.indexOf("http://") == -1 && $scope.pLink.indexOf("https://") == -1)
							$scope.pLink = "http://" + $scope.pLink;
							
						productService.addProduct($scope.pName, $scope.pLink, $scope.pCategory, $scope.pImage.name, $scope.pImageContents, function(data) {
							if(data) {
								messageService.setSuccess("Your add request has been submitted successfully.");
								$location.url('/home/products/1');
							}
						});
					}
					else {
						messageService.setError("You must insert a valid image.");
					}
				} else {
					messageService.setError("You must insert a valid website in the Link field.");
					$scope.linkError = true;
				}
			} else {
				messageService.setError("The name of the product must be longer than 3 characters.");
			}
        } else {
			messageService.setError("You must insert a valid name.");
        }
	}
});