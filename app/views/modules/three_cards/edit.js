$(document).ready(function(){

	//au click sur inerer une section
	$(' .editCardImage').click(function () {
		let id = this.id.split("-")[1]
		let number= this.id.split("-")[2]
		$("#siteOptionsModal").modal('open')
		$("a[href=#options-medias]").click()
		MediaManagment.render(true, "uglyForm-"+id+"-imgUrl"+number)
		initMainSaveBtn()
	})
})