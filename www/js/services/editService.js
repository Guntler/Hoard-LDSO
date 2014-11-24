hoard.service('editService',function($http, messageService) {
	var currEdits = [];
	var editCount = {integer: 0};
	return {
		updateEditsByPage: function(page, editsPerPage) {
			var Url = "/api/editrequests/fromTo/"+page+"/"+editsPerPage;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No edit requests found." );
				}
				else {
					currEdits = data;
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
			});
		},
		getEditById: function(id) {			
			
		},
		getCurrEdits: function() {
			return currEdits;
		},
		getEditCount: function() {
			return editCount;
		},
		updateEditCount: function() {
			var Url = "/api/editrequests/count/";
			$http.get(Url).success(function(data){
				if(data.result == false) {
					if(messageService.getMessages().errorMessage == null)
						messageService.setError("No edit requests found.");
				}
				else {
					editCount = {integer: data.count};
				}
			}).error(function(data,status,headers, config) {
				messageService.setError("There has been an unexpected error.");
			});
		}
	};
});