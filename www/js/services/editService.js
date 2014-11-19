hoard.service('editService',function($http, messageService) {
	var currEdits = [];
	var editCount = {integer: 0};
	return {
		updateEditsByPage: function(page, editsPerPage) {
			var Url = "/api/editrequests/fromTo/"+page+"/"+editsPerPage;
			$http.get(Url).success(function(data){
				if(data.result == false) {
					//messageService.setError(data.message[0]);
				}
				else {
					currEdits = data;
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
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
					//messageService.setError(data.message[0]);
				}
				else {
					editCount = {integer: data.count};
					//messageService.setSuccess(data.message[0]);
				}
			}).error(function(data,status,headers, config) {
				//messageService.setError(data.message[0]);
			});
		}
	};
});