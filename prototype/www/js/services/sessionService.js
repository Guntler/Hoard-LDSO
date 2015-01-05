angular.module('starter.sessionService', ['ngResource'])

app.factory('sessionService', function($http, $state, $location, $templateCache, messageService) {
	var user = null;
	return {
		checkUserExists: function(email) {
			var Url = "http://178.62.105.68:8081/api/users/email/"+email;
			var req = {
				 method: 'GET',
				 url: Url,
				 headers: {
				   'Cookie': window.localStorage['connect.sid']
				 }
			}
			$http(req).success(function(data){
				if(data.user != false)
				{
					return true;
				}
				else
					return false;
			});
		},
		signin: function(email, password, message) {
			var Url = "http://178.62.105.68:8081/api/users/signin-app";
			var info = {email: email, password: password};
			$http.post(Url, info).success(function(data, status, headers, config){
				if(data.user) {
					console.log(headers('set-cookie'));
					user = data.user;
					messageService.setSuccess(data.message[0]);
					if(headers('Set-Cookie') != undefined && headers('Set-Cookie') != null) {
						var index = headers('Set-Cookie').indexOf("=");
						var sid = headers('Set-Cookie').substring(index+1);
						console.log(headers('Set-Cookie'));
						console.log(sid);
						window.localStorage['connect.sid'] = sid;
					}
					$state.go('main');
				}
				else {
					messageService.setError(data.message[0]);
					$state.go('login');
				}
			}).error(function(data,status,headers, config) {
				messageService.setError(data.message[0]);
				$state.go('login');
			});
		},
		signout: function() {
			var Url = "http://178.62.105.68:8081/api/users/signout";
			$http.get(Url).success(function(data){
				$templateCache.removeAll();
				window.localStorage['connect.sid'] = undefined;
				$state.go('login');
			}).error(function(data, status, headers, config) {
				$templateCache.removeAll();
				window.localStorage['connect.sid'] = undefined;
				$state.go('login');
			});
		},
		updateUser: function() {
			var Url = "http://178.62.105.68:8081/api/users/current";
			var req = {
				 method: 'GET',
				 url: Url,
				 headers: {
				   'Cookie': window.localStorage['connect.sid']
				 }
			}
			$http(req).success(function(data){
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
			var Url = "http://178.62.105.68:8081/api/users/register";
			var info = {email: email, password: password};
			var req = {
				 method: 'POST',
				 url: Url,
				 headers: {
				   'Cookie': window.localStorage['connect.sid']
				 },
				 data: info
			}
			$http(req).success(function(data){
				if(data.success == false) {
					messageService.setError(data.message[0]);
				}
				else {
					messageService.setSuccess(data.message[0]);
					$state.go('login');
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