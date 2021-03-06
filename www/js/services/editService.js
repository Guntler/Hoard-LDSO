hoard.service('editService',function($http, messageService, sessionService) {
	return {
		getEditsByPage: function(page, editsPerPage, filterBy, filterVal, callback) {
			var Url = "/api/editrequests/fromTo/"+page+"/"+editsPerPage;
			if(filterBy != undefined && filterVal != undefined)
				Url += "?filterBy=" + filterBy + "&value=" + filterVal;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null) {
						if(data.err != null && data.err.code == "22P02")
							messageService.setError("No edit requests were found." );
						else if(sessionService.getUser().permissions != "Manager")
							messageService.setError("There has been an unexpected error." );
					}
					callback(null);
				}
				else if(data.result.length == 0) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No edit requests were found." );
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
		getEditById: function(id, callback) {
			var Url = "/api/editrequests/id/"+id;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
					callback(null);
				}
				else if(data.result == null) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Unable to find edit.");
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
		getEditCount: function(filterBy, filterVal, callback) {
			var Url = "/api/editrequests/count";
			if(filterBy != undefined && filterVal != undefined)
				Url += "?filterBy=" + filterBy + "&value=" + filterVal;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null) {
						if(data.err != null && data.err.code == "22P02")
							messageService.setError("No edit requests were found." );
						else if(sessionService.getUser().permissions != "Manager")
							messageService.setError("There has been an unexpected error." );
					}
					callback(null);
				}
				else if(data.result == null) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No edit requests were found.");
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
		resolveEdit: function(editID, approved, callback) {
			if(approved) {
				var Url = "/api/editrequests/approve/" + editID;
				$http.get(Url).success(function(data){
					if(data.success == false) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("There has been an unexpected error." );
						callback(false);
					}
					else if(data.result == null) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("Unable to resolve edit request.");
						callback(false);
					}
					else {
						messageService.setSuccess("Request has been approved successfully.");
						callback(true);
					}
				}).error(function(data,status,headers, config) {
					messageService.setError("There has been an unexpected error.");
					callback(false);
				});
			}
			else {
				var Url = "/api/editrequests/reject/" + editID;
				$http.get(Url).success(function(data){
					if(data.success == false) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("There has been an unexpected error." );
						callback(false);
					}
					else if(data.result == null) {
						if(messageService.getMessages().errorMessage == null)
							messageService.setError("Unable to resolve edit request.");
						callback(false);
					}
					else {
						messageService.setSuccess("Request has been rejected successfully.");
						callback(true);
					}
				}).error(function(data,status,headers, config) {
					messageService.setError("There has been an unexpected error.");
					callback(false);
				});
			}
			
		}
	};
});