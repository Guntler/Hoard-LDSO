angular.module('starter.registerController', ['starter.sessionService','starter.messageService','starter.userService'])

app.controller('RegisterController', function ($scope, sessionService, messageService, userService, $state, $ionicSideMenuDelegate) {

    $scope.password = "";
    $scope.email = "";
    $scope.errorMessage = null;
    $scope.successMessage = null;
    $scope.emailError = false;
    $scope.passwordError = false;
    $scope.hidSignIn = false;
    $scope.hidRecover = true;

	
    $scope.$watch(function () {
            return messageService.getMessages().errorMessage;
        },
        function () {
            $scope.errorMessage = messageService.getMessages().errorMessage;
        });

    $scope.$watch(function () {
            return messageService.getMessages().successMessage;
        },
        function () {
            $scope.successMessage = messageService.getMessages().successMessage;
        });
	
	
	$scope.viewLogin = function() {
		$state.go('login');
		messageService.setError(null);
	}
	
	$scope.viewRecoverPassword = function() {
		$state.go('recover');
		messageService.setError(null);
	}
	
	$scope.registerUser = function() {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ($scope.email.match(re)) {
			if($scope.password.length >= 6) {
				sessionService.registerUser($scope.email,$scope.password);
				messageService.setError(null);
			} else {
				messageService.setError("Password must be at least 6 characters long.");
			}
		} else {
			messageService.setError("Email must be valid!");
		}
	}
});