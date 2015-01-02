hoard.controller('userAreaController', function($scope, $cookieStore, sessionService, userService, messageService) {
	$scope.user = null;
	$scope.currPassword = null;
	$scope.newPassword = null;
	$scope.newPassword2 = null;
	
    $scope.passwordError = false;
	$scope.newPasswordError = false;
	
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
			if($scope.newPassword.length < 6) {
				$scope.newPasswordError = true;
				messageService.setError("New password length must be at least 6 characters.");
			}
			else {
				userService.changePassword($scope.currPassword, $scope.newPassword, function(data) {
					if(data) {
						messageService.setSuccess("Your password has been changed successfully.");
						$scope.passwordError = false;
						$scope.newPasswordError = false;
					}
					else {
						$scope.passwordError = true;
						$scope.newPasswordError = true;
						messageService.setError("Wrong information provided. Check to make sure you've inputed your password correctly.");
					}
						
				});
			}
		} else {
			$scope.newPasswordError = true;
			messageService.setError("Passwords don't match.");
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