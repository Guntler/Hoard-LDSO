hoard.service('userService',function($http, messageService) {
	var currUsers = [];
	var userCount = {integer: 0};
	return {
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
		getUserById: function(id) {			
			
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