$(document)
	.ready(function() {

		$('.ui.sidebar.signup').first()
			.sidebar('attach events', '.toggle.button.signup')
		;
		$('.ui.sidebar.signin').first()
			.sidebar('attach events', '.toggle.button.signin')
		;

	})
;