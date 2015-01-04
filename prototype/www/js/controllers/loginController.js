angular.module('starter.loginController', ['starter.sessionService','starter.messageService','starter.userService'])

app.controller('LoginController', function ($scope, sessionService, messageService, userService, $state, $ionicSideMenuDelegate) {

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
	
	
    $scope.fblogin = function () {
        checkLoginState(function (err, result) {
            if (result) {

                FB.api('/me', function (response) {
                    sessionService.signin(response.email, response.id);
                });

            } else {
                FB.login(function (response) {

                    FB.api('/me', function (response) {

                        if (sessionService.checkUserExists(response.email)) {
                            sessionService.signin(response.email, response.id);
                        } else {
                            sessionService.registerUser(response.email, response.id);
                        }
                    });

                }, {scope: 'public_profile,email'});
            }
        })
    };

    $scope.signin = function () {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ($scope.email.match(re)) {
            $scope.emailError = false;
            if ($scope.password.length > 5) {
                sessionService.signin($scope.email, $scope.password, $scope.errorMessage);
                $scope.passwordError = false;
            }
            else {
                messageService.setError("Your password must be over 6 characters.");
                $scope.passwordError = true;
            }
        }
        else {
            messageService.setError("You must insert a valid email address.");
            $scope.emailError = true;
        }

    };
	
	$scope.viewRecoverPassword = function() {
		$state.go('recover');
	}
	
	$scope.viewRegister = function() {
		$state.go('register');
	}
});