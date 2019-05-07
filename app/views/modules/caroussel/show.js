$(document).ready(function () {

		$('.carousel.carousel-slider').carousel({fullWidth: true,indicators: true });

if(!isAdminPage){
	let autoSlide = function () {
		setTimeout(function () {
			$('.carousel').carousel('next');
			autoSlide()
		},7000)
	}

autoSlide()
}
})


