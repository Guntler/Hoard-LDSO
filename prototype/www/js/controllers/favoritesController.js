angular.module('starter.favoritesController', ['starter.sessionService','starter.messageService','starter.userService']);

app.controller('FavoritesController', function ($scope, sessionService, messageService, userService, productService, $state, $ionicSideMenuDelegate, $cookieStore) {
	$scope.favorites = [];
	
	userService.getFavorites(function(result) {
		if(result != []) {
			$scope.favorites = result;
		}
		console.log($scope.favorites);
	});

	$scope.viewProfile = function() {
		$state.go('profile');
	}
	
	$scope.close = function() { 
		$state.go('main'); 
	};
	
	$scope.logout = function() {
		console.log("Hi");
		sessionService.signout();
		$cookieStore.remove("connect.sid");
	}
});