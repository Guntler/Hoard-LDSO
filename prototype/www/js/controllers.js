angular.module('starter.controllers', []);

app.controller('NavCtrl', function($scope, $state) {
	$scope.viewFavorites = function() {
		$state.go('favorites');
	}
	$scope.closeFavorites = function() { 
		$state.go('main'); 
	};
});  