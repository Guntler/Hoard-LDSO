hoard.controller('WelcomeController',function($scope,sessionService,messageService) {
	
	$scope.password = "";
	$scope.email = "";
	$scope.errorMessage = null;
	$scope.emailError = false;
	$scope.passwordError = false;
	
	$scope.$watch(function() {
					return messageService.getMessages().errorMessage;
				},
				function() {
					$scope.errorMessage = messageService.getMessages().errorMessage;
				});
	
	$scope.signin = function() {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if($scope.email.match(re)) {
				$scope.emailError = false;
				if($scope.password.length > 0) {
					sessionService.signin($scope.email, $scope.password, $scope.errorMessage);
					$scope.passwordError = false;
				}
				else {
					messageService.setError("Your password must be over 6 characters.");
					$scope.passwordError = true;
				}
			}
			else {
				messageService.setError("You must insert a valid email address.");
				$scope.emailError = true;
			}
		
	}
	
	$scope.showSigninSidebar = function() {
		var transition = $(this).data('transition');
		$('.signin.sidebar')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
		.sidebar('toggle');
		$('.signin.defaultFocus').focus();
		$(".signin.sidebar").addClass("beingUsed");
	};
	
	$scope.hideSidebar = function(e) {
		if (!$(e.target).parents('.signin.sidebar').length && $('.signin.sidebar').hasClass('beingUsed') &&  !$(e.target).hasClass('hoard')){
			$('.signin.sidebar').removeClass('beingUsed');
			var transition = $(this).data('transition');
			$('.signin.sidebar')
				.sidebar('setting', {
					transition       : transition,
					mobileTransition : transition
				})
			.sidebar('hide');
		}
	}
	
	var init = function () {
		messageService.clearAll();
		
		$('.signin.sidebar').removeClass('beingUsed');
		var transition2 = $(this).data('transition');
		$('.signin.sidebar')
			.sidebar('setting', {
				transition       : transition2,
				mobileTransition : transition2
			})
			.sidebar('hide');
			
		$('body').removeClass('right pushed');
   };
   
   init();
});