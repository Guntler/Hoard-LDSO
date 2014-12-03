hoard.service('editService',function($http, messageService) {
	return {
		getEditsByPage: function(page, editsPerPage, callback) {
			var Url = "/api/editrequests/fromTo/"+page+"/"+editsPerPage;
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
					callback(null);
				}
				else if(data.result.length == 0) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("Couldn't find requests." );
					calback(null);
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
				}
				else if(data.result == null) {
					if(messageService.getMessages().errorMessage == null) {
						messageService.setError("Unable to find edit.");
					}
					
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
		getEditCount: function(callback) {
			var Url = "/api/editrequests/count/";
			$http.get(Url).success(function(data){
				if(data.success == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("There has been an unexpected error." );
					callback(null);
				}
				if(data.result == null) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No edit requests found.");
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