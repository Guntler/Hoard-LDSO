$(document)
	.ready(function() {
		
		/*$('.sidebar.edit-profile').sidebar({
		overlay:true
		});*/
		
		$('.menu .item')
			.tab()
		;

		$('.item.edit-profile.selection').on('click', function() { 
			var transition = $(this).data('transition');
				$('.sidebar.edit-profile')
					.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
				})
			.sidebar('toggle');
			$('.edit-profile.defaultFocus').focus();
			$(".sidebar.edit-profile").addClass("beingUsed");
		})
		
		$(document).mouseup(function(e) {
			if (!$(e.target).parents('.signin.sidebar').length && $('.sidebar.edit-profile').hasClass('beingUsed')){
				$('.sidebar.edit-profile').removeClass('beingUsed');
				var transition = $(this).data('transition');
					$('.sidebar.edit-profile')
						.sidebar('setting', {
							transition       : transition,
							mobileTransition : transition
						})
				.sidebar('hide');
			}
		});
		
	})
;