$('.editGalleryImage').click(function () {
	let id = this.id.split("-")[1]
	let img=this.id.split("-")[2]
	$("#siteOptionsModal").modal('open')
	$("a[href=#options-medias]").click()
	MediaManagment.render(true, "uglyForm-"+id+"-imgUrl"+img)
	initMainSaveBtn()
})
$('.removeGalleryImage').click(function () {
	let id = this.id.split("-")[1]
	let field= this.id.split("-")[2]
	$('#uglyForm input[name=uglyForm-'+id+'-'+field+']').val("");
	$('#moduleValue-'+field).attr('src', 'app/views/modules/gallery/default.png')
	console.log(field)
	setTimeout(function () {
		$('.carousel.carousel-slider').carousel({fullWidth: true,indicators: true });
	},200)
	initMainSaveBtn()
})