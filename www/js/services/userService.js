hoard.service('userService',function($http, messageService) {
	var currUsers = [];
	var userCount = {integer: 0};
	var user = null;
	return {
		reset: function() {
			currUsers = [];
			userCount = {integer: 0};
			user = null;
		},
		updateUsersByPage: function(page, usersPerPage) {
			var Url = "/api/users/fromTo/"+page+"/"+usersPerPage;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					//messageService.setError(data.message[0]);
				}
				else {
					currUsers = data;
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
			});
		},
		getUser: function() {			
			return user;
		},
		updateUserById: function(id) {
			var Url = "/api/users/id/"+id;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					//messageService.setError(data.message[0]);
				}
				else {
					user = data;
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
			});
		},
		getCurrUsers: function() {
			return currUsers;
		},
		getUserCount: function() {
			return userCount;
		},
		updateUserCount: function() {
			var Url = "/api/users/count/";
			$http.get(Url).success(function(data){
				if(data.result == false) {
					//messageService.setError(data.message[0]);
				}
				else {
					userCount = {integer: data.count};
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
			});
		}
	};
});