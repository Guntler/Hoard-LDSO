hoard.controller('WelcomeController',function($scope,sessionService,messageService) {
	
	$scope.password = "";
	$scope.email = "";
	$scope.errorMessage = null;
	
	$scope.$watch(function() {
					return messageService.getMessages().errorMessage;
				},
				function() {
					$scope.errorMessage = messageService.getMessages().errorMessage;
				});
	
	$scope.signin = function() {
		sessionService.signin($scope.email, $scope.password, $scope.errorMessage);
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