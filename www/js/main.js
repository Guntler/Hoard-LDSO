'use strict';

var hoard = angular.module('hoard', ['ngRoute','ngCookies']);

hoard.config(function($routeProvider, $httpProvider) {
	$routeProvider.when('/', {
		controller: 'WelcomeController',
		templateUrl: 'partials/welcome.ejs'
	}).
	when('/home/:tab/:page', {
		controller: 'userAreaController',
		templateUrl: 'partials/user/frontpage.ejs'
	}).
	when('/users/:id', {
		controller: 'userAreaController',
		templateUrl: 'partials/user/profile.ejs'
	}).
	when('/products/:id', {
		controller: 'userAreaController',
		templateUrl: 'partials/product/profile.ejs'
	}).
	when('/edits/:id', {
		controller: 'userAreaController',
		templateUrl: 'partials/edit/edit.ejs'
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
}).filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
	});