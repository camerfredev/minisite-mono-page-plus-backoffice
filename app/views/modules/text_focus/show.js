$(document).ready(function () {
	$('.showOnScroll').each(function (i, el) {
		scrollFireOptions.push(
			{selector: '#'+el.id, offset: 200, callback: function(el1) {
					$(el1).animate({'left' :'+=1500'}, 350, 'swing')
				} })
	})
})

