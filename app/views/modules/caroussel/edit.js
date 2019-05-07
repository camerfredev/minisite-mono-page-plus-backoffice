$(document).ready(function(){

//au click sur inerer une section
	$('.editCarousselImage').click(function () {
		let id = this.id.split("-")[1]
		let img=this.id.split("-")[2]
		$("#siteOptionsModal").modal('open')
		$("a[href=#options-medias]").click()
		MediaManagment.render(true, "uglyForm-"+id+"-imgUrl"+img)
		initMainSaveBtn()
	})
	$('.removeCarousselImage').click(function () {
		let id = this.id.split("-")[1]
		let field= this.id.split("-")[2]
		$('#uglyForm input[name=uglyForm-'+id+'-'+field+']').val("");
		$('#moduleValue-'+field).attr('src', 'app/views/modules/caroussel/default.png')
		console.log(field)
		setTimeout(function () {
			$('.carousel.carousel-slider').carousel({fullWidth: true,indicators: true });
		},200)
		initMainSaveBtn()
	})
	$('.nextCaroussel').click(function () {
		$('.carousel').carousel('next');
	})
	$('.prevCaroussel').click(function () {
		$('.carousel').carousel('prev');
	})


})