angular.module('starter.headerController', ['starter.sessionService','starter.messageService','starter.userService']);

app.controller('headerController', function ($scope, sessionService, messageService, userService, productService, $state, $ionicSideMenuDelegate, $cookieStore) {

	$scope.viewProfile = function() {
		$state.go('profile');
	}
	
	$scope.viewFavorites = function() {
		$state.go('favorites');
	}
	
	$scope.logout = function() {
		sessionService.signout();
		$cookieStore.remove("connect.sid");
	}
});