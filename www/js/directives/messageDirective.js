hoard.directive('messageDirective',function(){
	return {
		templateUrl: 'partials/common/message.ejs',
		controller: 'messageController',
		scope: {
			messageType: '@'
		}
	};
});