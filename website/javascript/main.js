'use strict';

var hoard = angular.module('hoard', ['ngRoute']);

// ----------- Welcome page sidebar controller -------------//
hoard.controller('WelcomeController',function($scope) {
	$scope.showSignupSidebar = function() {
		var transition = $(this).data('transition');
		$('.signup.sidebar')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
			.sidebar('toggle');
		$('.signup.defaultFocus').focus();
		$(".signup.sidebar").addClass('beingUsed');
	};
	
	$scope.showSigninSidebar = function() {
		var transition = $(this).data('transition');
		$('.signin.sidebar')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
		.sidebar('toggle');
		$('.signin.defaultFocus').focus();
		$(".signin.sidebar").addClass("beingUsed");
	};
	
	$scope.hideSidebar = function(e) {
		if (!$(e.target).parents('.signin.sidebar').length && $('.signin.sidebar').hasClass('beingUsed')){
			$('.signin.sidebar').removeClass('beingUsed');
			var transition = $(this).data('transition');
			$('.signin.sidebar')
				.sidebar('setting', {
					transition       : transition,
					mobileTransition : transition
				})
			.sidebar('hide');
		} else if (!$(e.target).parents('.signup.sidebar').length && $('.signup.sidebar').hasClass('beingUsed')){
			$('.signup.sidebar').removeClass('beingUsed');
			var transition = $(this).data('transition');
			$('.signup.sidebar')
				.sidebar('setting', {
					transition       : transition,
					mobileTransition : transition
				})
			.sidebar('hide');
		}
	}
	
	var init = function () {
		$('.signup.sidebar').removeClass('beingUsed');
		var transition1 = $(this).data('transition');
		$('.signup.sidebar')
			.sidebar('setting', {
				transition       : transition1,
				mobileTransition : transition1
			})
			.sidebar('hide');
			
		$('.signin.sidebar').removeClass('beingUsed');
		var transition2 = $(this).data('transition');
		$('.signin.sidebar')
			.sidebar('setting', {
				transition       : transition2,
				mobileTransition : transition2
			})
			.sidebar('hide');
			
		$('body').removeClass('right pushed');
   };
   
   init();
});

// -------------- Logged in controller ------------- //

hoard.controller('FrontpageController', function($scope) {
	$scope.tab = "products";
	
	$scope.users = [];
	$scope.users.push({name: 'User1', date: 'Sep 14, 2014'});
	$scope.users.push({name: 'User2', date: 'Sep 14, 2014'});
	
	$scope.products = [];
	$scope.products.push({name: 'Product1', date: 'Sep 14, 2014'});
	$scope.products.push({name: 'Product2', date: 'Sep 14, 2014'});
	
	$scope.edits = [];
	$scope.edits.push({name: 'Edit1', date: 'Sep 14, 2014'});
	$scope.edits.push({name: 'Edit2', date: 'Sep 14, 2014'});
	
	$scope.showTab = function(tab) {
		$scope.tab = tab;
	}
			
	$scope.showSidebar = function() {
		var transition = $(this).data('transition');
		$('.sidebar.edit-profile')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
			.sidebar('toggle');
		$('.edit-profile.defaultFocus').focus();
		$(".sidebar.edit-profile").addClass("beingUsed");
	};
	
	$scope.hideSidebar = function(e) {
		if (!$(e.target).parents('.signin.sidebar').length && $('.sidebar.edit-profile').hasClass('beingUsed')){
				$('.sidebar.edit-profile').removeClass('beingUsed');
				var transition = $(this).data('transition');
				$('.sidebar.edit-profile')
					.sidebar('setting', {
						transition       : transition,
						mobileTransition : transition
					})
				.sidebar('hide');
		}
	}
	
	var init = function () {
		$('.sidebar.edit-profile').removeClass('beingUsed');
		var transition = $(this).data('transition');
		$('.sidebar.edit-profile')
			.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
			})
			.sidebar('hide');
			
		$('body').removeClass('right pushed');
   };
   
   init();
});

// ------------ Routing ------------ //

hoard.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'WelcomeController',
		templateUrl: 'p/user/welcome.html'
	}).
	when('/user/frontpage', {
		controller: 'FrontpageController',
		templateUrl: 'p/user/frontpage.html'
	}).
	when('/user/profile', {
		controller: 'FrontpageController',
		templateUrl: 'p/user/profile.html'
	}).
	when('/product/profile', {
		controller: 'FrontpageController',
		templateUrl: 'p/product/profile.html'
	}).
	when('/user/edit', {
		controller: 'FrontpageController',
		templateUrl: 'p/user/edit.html'
	}).
	otherwise({template: '<h1> 404 Page Not Found </h1>'});
}]);