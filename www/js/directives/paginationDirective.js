hoard.directive('paginationDirective',function(){
	return {
		templateUrl: 'partials/common/pagination.ejs',
		controller: 'paginationController',
		scope: {
			totalItems: '=',
			currentPage: '=',
			pageRange: '=',
			itemsPerPage: '=',
			itemType: '=',
			redirectUrl: '@'
		}
	};
});