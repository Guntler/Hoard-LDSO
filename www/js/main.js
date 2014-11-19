'use strict';

var hoard = angular.module('hoard', ['ngRoute']);

hoard.config(function($routeProvider, $httpProvider) {
	$routeProvider.when('/', {
		controller: 'WelcomeController',
		templateUrl: 'partials/welcome.ejs'
	}).
	when('/home/:tab/:page', {
		controller: 'userAreaController',
		templateUrl: 'partials/user/frontpage.ejs'
	}).
	when('/users/:user', {
		controller: 'userAreaController',
		templateUrl: 'partials/user/profile.ejs'
	}).
	when('/products/:product', {
		controller: 'userAreaController',
		templateUrl: 'partials/product/profile.ejs'
	}).
	when('/edits/:edit', {
		controller: 'userAreaController',
		templateUrl: 'partials/user/edit.ejs'
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
});