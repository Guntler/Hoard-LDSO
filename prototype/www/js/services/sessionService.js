angular.module('starter.sessionService', ['ngResource'])

app.factory('sessionService', function($http, $location, $templateCache, messageService) {
	var user = null;
	return {
		checkUserExists: function(email) {
			var Url = "/api/users/email/"+email;
			$http.get(Url).success(function(data){
				if(data.user != false)
				{
					return true;
				}
				else
					return false;
			});
		},
		signin: function(email, password, message) {
			console.log("HERE");
			var Url = "http://178.62.105.68:8081/api/users/signin";
			var info = {email: email, password: password};
			$http.post(Url, info).success(function(data){
				if(data.user) {
					user = data.user;
					messageService.setSuccess(data.message[0]);
					$location.url('/home/products/1');
				}
				else {
					messageService.setError(data.message[0]);
					$location.url('/');
				}
			}).error(function(data,status,headers, config) {
				messageService.setError(data.message[0]);
				$location.url('/');
			});
		},
		signout: function() {
			var Url = "/api/users/signout";
			$http.get(Url).success(function(data){
				$templateCache.removeAll();
				$location.url('/');
			}).error(function(data, status, headers, config) {
				$templateCache.removeAll();
				$location.url('/');
			});
		},
		updateUser: function() {
			var Url = "/api/users/current";
			$http.get(Url).success(function(data){
				if(data.user != false)
				{
					user = data.user;
				}
				else
					user = null;
			}).error(function(data, status, headers, config) {
				user = null;
			});
		},
		registerUser: function(email,password) {
			var Url = "/api/users/register";
			var info = {email: email, password: password};
			$http.post(Url,info).success(function(data){
				if(data.success == false) {
					alert("User could not be created.");
				}
				else {
					alert("User created successfully.");
					$location.url('/');
				}
			}).error(function(data, status, headers, config) {
				user = null;
			});
		},
		getUser: function() {
			return user;
		}
	}
});