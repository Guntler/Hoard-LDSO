hoard.controller('userAreaController', function($scope, $cookieStore, sessionService, userService) {
	$scope.user = null;
	$scope.currPassword = null;
	$scope.newPassword = null;
	$scope.newPassword2 = null;
	
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
		if (!$(e.target).parents('.sidebar.edit-profile').length && $('.sidebar.edit-profile').hasClass('beingUsed') && !$(e.target).hasClass('edit-profile')){
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
	
	$scope.changePassword = function() {
		if($scope.newPassword == $scope.newPassword2) {
			userService.changePassword($scope.currPassword, $scope.newPassword, function(data) {
				if(data)
					console.log("success");
			});
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