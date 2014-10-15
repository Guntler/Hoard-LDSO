angular.module('starter.controllers', []);

app.controller('NavCtrl', function($scope, $state, $ionicSideMenuDelegate) {//, User) {
	/*$scope.profile = {
		email: '',
		password: ''
	};
  
	$scope.submitInfo = function() {
		User.create($scope.profile).then(function(userId) {
		$scope.post = {
			email: '',
			password: ''
		};
		$state.go('settings');
		});
	}*/
	
	$scope.viewSettings = function() {
		$state.go('settings');
	}
	$scope.viewFavorites = function() {
		$state.go('favorites');
	}
	$scope.close = function() { 
		$state.go('main'); 
	};
}); 