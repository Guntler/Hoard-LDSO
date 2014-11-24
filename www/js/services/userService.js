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
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No users were found.");
				}
				else {
					currUsers = data;
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
			});
		},
		getUser: function() {			
			return user;
		},
		updateUserById: function(id) {
			var Url = "/api/users/id/"+id;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Unable to find user.");
				}
				else {
					user = data;
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
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
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No users were found.");
				}
				else {
					userCount = {integer: data.count};
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
			});
		}
	};
});