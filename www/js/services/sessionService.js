hoard.service('sessionService', function($http, $location, $templateCache, messageService) {
	var user = null;
	
	return {
		signin: function(email, password, message) {
			var Url = "/api/users/signin";
			var info = {email: email, password: password};
			$http.post(Url, info).success(function(data){
				if(data.user) {
					user = data.user;
					messageService.setSuccess(data.message[0]);
					$location.url('/user/frontpage');
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
		getUser: function() {
			return user;
		}
	}
});