$(document)
	.ready(function() {
		
		
		$('.signup.button').on('click', function() { 
			var transition = $(this).data('transition');
				$('.signup.sidebar')
					.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
				})
			.sidebar('toggle');
			$('.signup.defaultFocus').focus();
			$(".signup.sidebar").addClass('beingUsed');
		})
		
		$('.signin.button').on('click', function() { 
			var transition = $(this).data('transition');
				$('.signin.sidebar')
					.sidebar('setting', {
				transition       : transition,
				mobileTransition : transition
				})
			.sidebar('toggle');
			$('.signin.defaultFocus').focus();
			$(".signin.sidebar").addClass("beingUsed");
		})
		
		$(document).mouseup(function(e) {
			if (!$(e.target).parents('.signin.sidebar').length && $('.signin.sidebar').hasClass('beingUsed')){
				$('.signin.sidebar').removeClass('beingUsed');
				var transition = $(this).data('transition');
					$('.signin.sidebar')
						.sidebar('setting', {
							transition       : transition,
							mobileTransition : transition
						})
				.sidebar('hide');
			}
		});
		
		$(document).mouseup(function(e) { 
			if (!$(e.target).parents('.signup.sidebar').length && $('.signup.sidebar').hasClass('beingUsed')){
				$('.signup.sidebar').removeClass('beingUsed');
				var transition = $(this).data('transition');
					$('.signup.sidebar')
						.sidebar('setting', {
							transition       : transition,
							mobileTransition : transition
						})
				.sidebar('hide');
			}
		});
	})
;