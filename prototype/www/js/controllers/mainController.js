angular.module('starter.mainController', ['starter.sessionService','starter.messageService','starter.userService']);

app.controller('MainController', function ($scope, sessionService, messageService, userService, productService, $state, $ionicSideMenuDelegate) {
	$scope.products = [];
	
	

	$scope.viewProfile = function() {
		$state.go('profile');
	}
	
	$scope.logout = function() {
		sessionService.signout();
		$cookieStore.remove("connect.sid");
	}
});