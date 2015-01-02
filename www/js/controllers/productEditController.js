hoard.controller('productEditController', function ($scope, $routeParams, $location, productService, editService, userService, messageService) {

    //State variables
    $scope.productId = $routeParams.id;
    $scope.currentPage = $routeParams.page;
    $scope.itemsPerPage = 10;
    $scope.pageRange = 3;
    $scope.totalEdits = 0;
    $scope.edits = [];
	$scope.pImageContents = null;
	$scope.pImageName = "";

    $scope.addedBy = null;
    $scope.product = null;
    $scope.category = null;
    $scope.reason = null;

    $scope.editProduct = function (productid, reason, name, link, imageName, category) {
		if($scope.pImageName != "") {
			productService.editProduct(productid, reason, name, link, $scope.pImage.name, $scope.pImageContents, category, function (result) {
				if (result) {
					messageService.setSuccess("Your edit request has been submitted successfully.");
					$location.path('home/products/1');
				}
			})
		}
		else {
			productService.editProduct(productid, reason, name, link, imageName, null, category, function (result) {
				if (result) {
					messageService.setSuccess("Your edit request has been submitted successfully.");
					$location.path('home/products/1');
				}
			})
		}
    };
	
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

    productService.getProductById($routeParams.id, function (prod) {
        $scope.product = prod;

        if ($scope.product != null) {
            userService.getUserById($scope.product.addedby, function (data) {
                $scope.addedBy = data;
            });
            productService.getCategoryById($scope.product.category, function (data) {
                var category = data.categoryid - 1;
                productService.getCategories(function (result) {
                    $scope.categories = result;
                    $scope.category = $scope.categories[category];
                });
            });
        }
    });


    $scope.approveEdit = function (edit) {
        if (edit.editstatus == "Pending")
            editService.resolveEdit(edit.id, true, function (result) {
                if (result)
                    edit.editstatus = "Approved";
            });
    };

    $scope.rejectEdit = function (edit) {
        if (edit.editstatus == "Pending")
            editService.resolveEdit(edit.id, false, function (result) {
                if (result)
                    edit.editstatus = "Denied";
            });
    }
});