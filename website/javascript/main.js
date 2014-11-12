'use strict';

var hoard = angular.module('hoard', ['ngRoute']);

hoard.service('sessionService', function($http, $location) {
	var user = null;
	
	return {
		signin: function(email, password) {
			var Url = "/actions/user/signin";
			var info = {email: email, password: password};
			$http.post(Url, info).success(function(data){
				$location.url('/user/frontpage');
				user = data;
			}).error(function(data,status,headers, config) {
				$location.url('/');
			});
		},

		signout: function() {
			
		},

		getUser: function() {
			return user;
		}
	}
});
// ----------- Welcome page sidebar controller -------------//
hoard.controller('WelcomeController',function($scope,sessionService) {
	
	$scope.password = "";
	$scope.email = "";
	
	$scope.signin = function() {
		sessionService.signin($scope.email,$scope.password);
	}
	
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
		if (!$(e.target).parents('.signin.sidebar').length && $('.signin.sidebar').hasClass('beingUsed') &&  !$(e.target).hasClass('hoard')){
			$('.signin.sidebar').removeClass('beingUsed');
			var transition = $(this).data('transition');
			$('.signin.sidebar')
				.sidebar('setting', {
					transition       : transition,
					mobileTransition : transition
				})
			.sidebar('hide');
		}
	}
	
	var init = function () {	
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

hoard.controller('FrontpageController', function($scope, sessionService) {
	$scope.tab = "products";
	$scope.user = sessionService.getUser();
	
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
		if (!$(e.target).parents('.signin.sidebar').length && $('.sidebar.edit-profile').hasClass('beingUsed') && !$(e.target).hasClass('edit-profile')){
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

hoard.config(/*['$routeProvider', */function($routeProvider, $httpProvider) {
	$routeProvider.when('/', {
		controller: 'WelcomeController',
		templateUrl: 'p/welcome.ejs'
	}).
	when('/user/frontpage', {
		controller: 'FrontpageController',
		templateUrl: 'p/user/frontpage.ejs'
	}).
	when('/user/profile', {
		controller: 'FrontpageController',
		templateUrl: 'p/user/profile.ejs'
	}).
	when('/product/profile', {
		controller: 'FrontpageController',
		templateUrl: 'p/product/profile.ejs'
	}).
	when('/user/edit', {
		controller: 'FrontpageController',
		templateUrl: 'p/user/edit.ejs'
	}).
	otherwise({template: '<h1> 404 Page Not Found </h1>'});
	
	$httpProvider.responseInterceptors.push(function($q, $location) { 
		return function(promise) { 
			return promise.then( 
			// Success: just return the response 
			function(response){ 
				return response; 
			}, 
			// Error: check the error status to get only the 401 
			function(response) { 
				if (response.status === 401) 
					$location.url('/'); 
				return $q.reject(response); 
			}); 
		} 
	});
}/*]*/);