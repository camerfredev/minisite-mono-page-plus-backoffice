$(document).ready(function () {
	$('#editEmailModal').modal()
	let email = $('#adminEmail').val()
	if (!email) {
		$('#editMailBtn').addClass('pulse')
		setTimeout(()=>{
			$('#editEmailModal').modal('open')
		}, 400)
	}
	//au click sur inerer une section

	$('.editEmailForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let email = $('#editEmailForm-' + sectionId + " #adminEmail").val()
		$('#uglyForm input[name=uglyForm-' + sectionId + '-email]').val(email)
		$('#editEmailModal').modal('close')
		initMainSaveBtn()
		$('#editMailBtn').removeClass("pulse")
	})

})