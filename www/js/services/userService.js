hoard.service('userService',function($http, messageService) {
	var currUsers = [];
	var userCount = {integer: 0};
	return {
		reset: function() {
			currUsers = [];
			userCount = {integer: 0};
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
		updateUserById: function(id, callback) {
			var Url = "/api/users/id/"+id;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Unable to find user.");
					
					callback(null);
				}
				else {
					callback(data);
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
				callback(null);
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