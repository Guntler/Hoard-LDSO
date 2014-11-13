hoard.controller('FrontpageController', function($scope, sessionService) {
	$scope.tab = "products";
	$scope.user = null;
	
	$scope.$watch(function() {
					return sessionService.getUser();
				},
				function() {
					$scope.user = sessionService.getUser();
				});
	
	$scope.users = [];
	$scope.users.push({name: 'User1', date: 'Sep 14, 2014'});
	$scope.users.push({name: 'User2', date: 'Sep 14, 2014'});
	
	$scope.products = [];
	$scope.products.push({name: 'Product1', date: 'Sep 14, 2014'});
	$scope.products.push({name: 'Product2', date: 'Sep 14, 2014'});
	
	$scope.edits = [];
	$scope.edits.push({name: 'Edit1', date: 'Sep 14, 2014'});
	$scope.edits.push({name: 'Edit2', date: 'Sep 14, 2014'});
	
	$scope.showTab = function(tab) {
		$scope.tab = tab;
	}
	
	$scope.logout = function() {
		sessionService.signout();
	}
			
	$scope.showSidebar = function() {
		var transition = $(this).data('transition');
		$('.sidebar.edit-profile')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
			.sidebar('toggle');
		$('.edit-profile.defaultFocus').focus();
		$(".sidebar.edit-profile").addClass("beingUsed");
	};
	
	$scope.hideSidebar = function(e) {
		if (!$(e.target).parents('.signin.sidebar').length && $('.sidebar.edit-profile').hasClass('beingUsed') && !$(e.target).hasClass('edit-profile')){
				$('.sidebar.edit-profile').removeClass('beingUsed');
				var transition = $(this).data('transition');
				$('.sidebar.edit-profile')
					.sidebar('setting', {
						transition       : transition,
						mobileTransition : transition
					})
				.sidebar('hide');
		}
	}
	
	var init = function () {
		sessionService.updateUser();
	
		$('.sidebar.edit-profile').removeClass('beingUsed');
		var transition = $(this).data('transition');
		$('.sidebar.edit-profile')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
			.sidebar('hide');
			
		$('body').removeClass('right pushed');
   };
   
   init();
});