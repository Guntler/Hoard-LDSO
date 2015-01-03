angular.module('starter.services', ['ngResource'])

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
	$scope.viewRegister = function() {
		$state.go('register');
	}
	$scope.login = function() {
		$state.go('main');
	}
	$scope.submitRange = function() {
		/*TODO*/
	};
	
	$scope.doRegister = function() {
		/*TODO*/
		$state.go('login');
	}
	$scope.doLogin = function() {
		/*TODO*/
		$state.go('main');
	}
	$scope.doLogout = function() {
		/*TODO*/
		$state.go('login');
	}
}); 