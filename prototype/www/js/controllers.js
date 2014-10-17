angular.module('starter.controllers', []);

app.controller('NavCtrl', function($scope, $state, $ionicSideMenuDelegate) {//, User) {
	$scope.submitInfo = function() {
		/*TODO*/
	}
	
	$scope.viewProfile = function() {
		$state.go('profile');
	}
	$scope.viewFilters = function() {
		$state.go('filters');
	}
	$scope.logout = function() {
		/*log out*/
	}
	$scope.viewFavorites = function() {
		$state.go('favorites');
	}
	$scope.close = function() { 
		$state.go('main'); 
	};
	$scope.submitRange = function() {
		/*TODO*/
	};
}); 