hoard.controller('userAreaController', function($scope, $cookieStore, sessionService) {
	$scope.user = null;
	
	$scope.$watch(function() {
					return sessionService.getUser();
				},
				function() {
					$scope.user = sessionService.getUser();
				});
	
	$scope.logout = function() {
		sessionService.signout();
		$cookieStore.remove("connect.sid");
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