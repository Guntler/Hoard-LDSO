hoard.service('userService',function($http, messageService) {
	return {
		getUsersByPage: function(page, usersPerPage, filterBy, filterVal, search, callback) {
			var first = true;
			var Url = "/api/users/fromTo/"+page+"/"+usersPerPage;
			if(filterBy != undefined && filterBy != null && filterVal != undefined && filterVal != null) {
				Url += "?filterBy=" + filterBy + "&value=" + filterVal;
				first = false;
			}
			if(search != undefined && search != null) {
				if(first)
					Url += "?";
				else Url += "&";
				Url += "search=" + search;
			}
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null) {
						if(data.err != null && data.err.code == "22P02")
							messageService.setError("No users were found." );
						else
							messageService.setError("There has been an unexpected error." );
					}
					callback(null);
				}
				else if(data.result.length == 0) {
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
				else if(data.result == null) {
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
		getUserCount: function(filterBy, filterVal, search, callback) {
			var Url = "/api/users/count";
			if(filterBy != undefined && filterBy != null && filterVal != undefined && filterVal != null) {
				Url += "?filterBy=" + filterBy + "&value=" + filterVal;
				first = false;
			}
			if(search != undefined && search != null) {
				if(first)
					Url += "?";
				else Url += "&";
				Url += "search=" + search;
			}
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null) {
						if(data.err != null && data.err.code == "22P02")
							messageService.setError("No users were found." );
						else
							messageService.setError("There has been an unexpected error.");
					}
					callback(null);
				}
				else if(data.result == null) {
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
		},
		recoverPassword: function(email) {
			var Url = "/api/users/forgotPassword/" + email;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No account associated with that email.");
				}
				if(data.result == null) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No account associated with that email.");
				}
				else {
					messageService.setSuccess("A new password was sent to your email!");
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
				callback(null);
			});
		},
		changePermissions: function(userID, permission, callback) {
			var Url = "/api/users/changePermissions/" + userID + "?permission=" + permission;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error.");
					callback(false);
				}
				else if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Unable to change user permissions.");
					callback(false);
				}
				else {
					messageService.setSuccess("User permissions successfully changed!");
					callback(true);
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
				callback(false);
			});
		},
		changePassword: function(oldPassword, newPassword, callback) {
			var Url = "/api/users/changePassword";
            var info = {oldPassword: oldPassword, newPassword: newPassword};
			$http.post(Url, info).success(function (data) {
                if (data.success == false) {
                    if (messageService.getMessages().errorMessage == null)
                        messageService.setError("There has been an unexpected error.");
					callback(null);
                }
                else {
                    callback(data.result);
                }
            }).error(function (data, status, headers, config) {
                messageService.setError("There has been an unexpected error.");
				callback(null);
            });
		}
	};
});