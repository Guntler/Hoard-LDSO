hoard.service('userService',function($http, messageService) {
	return {
		getUsersByPage: function(page, usersPerPage, callback) {
			var Url = "/api/users/fromTo/"+page+"/"+usersPerPage;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
					callback(null);
				}
				if(data.result.length == 0) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No users were found.");
					callback(null);
				}
				else {
					callback(data.result);
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
				callback(null);
			});
		},
		getUserById: function(id, callback) {
			var Url = "/api/users/id/"+id;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
					callback(null);
				}
				if(data.result == null) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Unable to find user.");
					callback(null);
				}
				else {
					callback(data.result);
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
				callback(null);
			});
		},
		getUserCount: function(callback) {
			var Url = "/api/users/count/";
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
					callback(null);
				}
				if(data.result == null) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No users were found.");
					callback(null);
				}
				else {
					callback({integer: data.result.count});
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
				callback(null);
			});
		}
	};
});