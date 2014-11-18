hoard.service('breadcrumbService',function($location) {
	var path = null;
	
	return {
		getPath: function() {
			return path;
		},
		updatePath: function() {
			var path = $location.path();
			
			
		}
	};
});