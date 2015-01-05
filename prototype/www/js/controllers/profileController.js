angular.module('starter.profileController', ['starter.sessionService','starter.messageService','starter.userService']);

app.controller('ProfileController', function ($scope, sessionService, messageService, userService, $state, $ionicSideMenuDelegate) {
	$scope.previousEmail = "";
	$scope.previousPassword = "";
	$scope.user = null;
	
	$scope.init = function() {
		$scope.user = sessionService.getUser();
		console.log(sessionService.getUser());
		$scope.previousEmail = $scope.user.email;
		$scope.previousPassword = $scope.user.password;
	}
	
	$scope.changePassword = function() {
		if($scope.password != "" && $scope.password != null) {
			$state.go('main');
			messageService.setError(null);
		} else {
			userService.changePassword($scope.previousPassword,$scope.password, function (data) {
				if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error. Password could not be changed.");
					callback(null);
                }
                else {
					messageService.setError("Password changed successfully!");
                    callback(data.result);
                }
			});
			$state.go('main');
		}
	}
	
	$scope.init();
});