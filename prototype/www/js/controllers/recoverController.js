angular.module('starter.recoverController', ['starter.messageService','starter.userService'])

app.controller('RecoverController', function ($scope, messageService, userService, $state, $ionicSideMenuDelegate) {
	$scope.email = "";
	
	$scope.recoverPassword = function () {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ($scope.email.match(re)) {
            messageService.clearAll();
            $scope.emailError = false;
            userService.recoverPassword(email);
        } else {
            messageService.setError("You must insert a valid email address.");
            $scope.emailError = true;
        }
    }
	
	$scope.viewLogin = function() {
		$state.go('login');
	}
});