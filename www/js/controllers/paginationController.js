hoard.controller('paginationController',function($scope,$location) {
	$scope.pages = [];
	$scope.totalPages = 0;
	$scope.currPage = 0;
	
	$scope.$watch(function() {
					return $scope.totalItems;
				},
				function() {
					getPages($scope.currentPage,$scope.totalItems,$scope.itemsPerPage,$scope.pageRange);
				});

	function getPages(currentPage,totalItems,itemsPerPage,pageRange) {
		$scope.pages = [];
		$scope.totalPages = Math.ceil(totalItems/itemsPerPage);
		
		if($scope.totalPages != 0)
			$scope.currPage = $scope.currentPage;
		
		var ellipsisAtStart = false;
		if((parseInt(currentPage) - pageRange) > 2)
			ellipsisAtStart = true;
			
		var ellipsisAtEnd = false;
		if((parseInt(currentPage) + pageRange) < $scope.totalPages-1)
			ellipsisAtEnd = true;
			
		$scope.pages.push("1");
		if(ellipsisAtStart)
			$scope.pages.push("...");
		
		var i = parseInt(currentPage) - pageRange;
		if(i <= 1)
			var i = 2;
		for(; i <= parseInt(currentPage) + pageRange && i < $scope.totalPages; i++) {
			$scope.pages.push(""+i);
		};
		
		if(ellipsisAtEnd)
			$scope.pages.push("...");
		
		if($scope.totalPages > 1)
			$scope.pages.push("" + $scope.totalPages);
	};
	
	getPages($scope.currentPage,$scope.totalItems,$scope.itemsPerPage,$scope.pageRange);
	
	$scope.changePage = function(page) {
		if(page !== "...") {
			if(page == "next" && $scope.currentPage < $scope.totalPages) {
				var nextPage = parseInt($scope.currentPage)+1;
				$location.path($scope.redirectUrl + "/" + $scope.itemType + "/" + nextPage);
			}
			else if(page == "previous" && $scope.currentPage > 1) {
				var previousPage = parseInt($scope.currentPage)-1;
				$location.path($scope.redirectUrl + "/" + $scope.itemType + "/" + previousPage);
			}
			else if(page != "previous"&& page != "next")
				$location.path($scope.redirectUrl + "/" + $scope.itemType + "/" + page);
		}
	};
});