angular.module('starter.mainController', ['starter.sessionService','starter.messageService','starter.userService']);

app.controller('MainController', function ($scope, sessionService, messageService, userService, productService, $state, $ionicSideMenuDelegate, $cookieStore) {
	$scope.products = [];
	
	productService.viewProducts(10, function(result) {
		if(result != [])
			$scope.products = result;
		console.log($scope.products);
	});

	$scope.viewProfile = function() {
		$state.go('profile');
	}
	
	$scope.logout = function() {
		sessionService.signout();
		$cookieStore.remove("connect.sid");
	}
});