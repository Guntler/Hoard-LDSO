hoard.controller('WelcomeController', function ($scope, sessionService, messageService, userService) {

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
                    sessionService.checkUserExists(response.email, function (result) {
                        console.log(result);
                        if (result) {
                            sessionService.signin(response.email, response.id);

                        } else {
                            sessionService.registerUser(response.email, response.id);
                        }
                    });

                });

            } else {
                FB.login(function (response) {

                    FB.api('/me', function (response) {

                        sessionService.checkUserExists(response.email, function (result) {
                            if (result) {
                                sessionService.signin(response.email, response.id);

                            } else {
                                sessionService.registerUser(response.email, response.id);
                            }
                        });
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

    $scope.recoverPassword = function (email) {
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

    $scope.toggleRecoverPassword = function () {
        $scope.hidSignIn = !$scope.hidSignIn;
        $scope.hidRecover = !$scope.hidRecover;
    };

    $scope.showSigninSidebar = function () {
        var transition = $(this).data('transition');
        $('.signin.sidebar')
            .sidebar('setting', {
                transition: transition,
                mobileTransition: transition
            })
            .sidebar('toggle');
        $('.signin.defaultFocus').focus();
        $(".signin.sidebar").addClass("beingUsed");
    };

    $scope.hideSidebar = function (e) {
        if (!$(e.target).parents('.signin.sidebar').length && $('.signin.sidebar').hasClass('beingUsed') && !$(e.target).hasClass('hoard')) {
            $('.signin.sidebar').removeClass('beingUsed');
            var transition = $(this).data('transition');
            $('.signin.sidebar')
                .sidebar('setting', {
                    transition: transition,
                    mobileTransition: transition
                })
                .sidebar('hide');
        }
    }

    var init = function () {
        messageService.clearAll();

        $('.signin.sidebar').removeClass('beingUsed');
        var transition2 = $(this).data('transition');
        $('.signin.sidebar')
            .sidebar('setting', {
                transition: transition2,
                mobileTransition: transition2
            })
            .sidebar('hide');

        $('body').removeClass('right pushed');
    };

    init();
});