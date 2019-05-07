$(document).ready(function(){
	$('.editCaroutextImage').click(function () {
		let id = this.id.split("-")[1]
		let img=this.id.split("-")[2]
		$("#siteOptionsModal").modal('open')
		$("a[href=#options-medias]").click()
		MediaManagment.render(true, "uglyForm-"+id+"-imgUrl"+img)
		initMainSaveBtn()
		setTimeout(function () {
			makeCaroutextBeautifull(id)
		},350)
	})
})