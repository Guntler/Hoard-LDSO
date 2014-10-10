$(document)
	.ready(function() {

		$('.ui.sidebar.login').first()
			.sidebar('attach events', '.toggle.button.login')
		;

	})
;