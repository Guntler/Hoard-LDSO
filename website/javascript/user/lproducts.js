$(document)
	.ready(function() {

		$('.menu .item')
			.tab()
		;

		$('.sidebar.edit-profile').first()
			.sidebar('attach events', '.item.edit-profile.selection')
		;
	})
;