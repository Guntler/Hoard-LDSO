hoard.service('sessionService', function($http, $location, $templateCache, messageService) {
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
			var Url = "/api/users/signin";
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
					//TODO Error message
				}
				else {
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