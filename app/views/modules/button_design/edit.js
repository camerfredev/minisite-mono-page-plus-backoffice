$(document).ready(function () {
	$('.editBtnImage').click(function () {
		let id = this.id.split("-")[1]
		$("#siteOptionsModal").modal('open')
		$("a[href=#options-medias]").click()
		MediaManagment.render(true, "uglyForm-" + id + "-imgUrl")
		initMainSaveBtn()
	})
	$('.removeBtnImage').click(function () {
		let id = this.id.split("-")[1]

		$('#uglyForm input[name=uglyForm-' + id + '-imgUrl]').val("");
		$('#'+id+' #moduleValue-imgUrl').attr('src', '')
		initMainSaveBtn()
	})

	$('.editBtnModal').modal()
	$('.editBtnForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let label = $('#editBtnForm-' + sectionId + " input[name=label]").val()
		let value = $('#editBtnForm-' + sectionId + " input[name=value]").val()
		$('#uglyForm input[name=uglyForm-' + sectionId + '-btnLabel]').val(label)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-btnValue]').val(value)
		$('#btnModuleBtn-'+sectionId).html(label)
		$('#btnModuleBtn-'+sectionId).attr('href', value)
		$('.editBtnModal').modal('close')
		initMainSaveBtn()
	})
})