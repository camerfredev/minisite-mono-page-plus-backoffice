$(document).ready(function () {
	$('.editSocialMediaBtn').click(function () {
		let socialMediaName = this.id.split('~')[1]
		let socialMediaUrl = this.id.split('~')[2]
		let sectionId = this.id.split('~')[3]
		$('#editSocialMediaForm-' + sectionId + " input[name=label]").val(socialMediaName)
		$('#editSocialMediaForm-' + sectionId + " input[name=link]").val(socialMediaUrl)
		$('#socialMediaImg-'+sectionId ).html(`<img src="app/views/modules/social_media/${socialMediaName}.png" class="responsive-img">`)
		$('#socialMediaName-'+sectionId ).html(socialMediaName)
		$('#editSocialMediaModal-'+sectionId ).modal('open')
		setTimeout(()=>{
			Materialize.updateTextFields();
		},150)
	})
	$('.removeSocialMediaBtn').click(function (e) {
		e.preventDefault()
		let socialMediaName = this.id.split('~')[1]
		let sectionId = this.id.split('~')[3]
		$('#uglyForm input[name=uglyForm-' + sectionId + '-'+socialMediaName).val("")
		$(this).addClass('displaynone')
		$('#socialMediaLabel-' + sectionId +'-' +socialMediaName).html("")
	})
	$('.editSocialMediaModal').modal()
	$('.editSocialMediaForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let label = $('#editSocialMediaForm-' + sectionId + " input[name=label]").val()
		let value = $('#editSocialMediaForm-' + sectionId + " input[name=link]").val()
		$('#uglyForm input[name=uglyForm-' + sectionId + '-'+label).val(value)
			$('#socialMediaLabel-' + sectionId +'-' +label).html(value?label:"")

		$('#socialBtn-'  +label+'-'+ sectionId).attr('href', value)
		$('.editSocialMediaModal').modal('close')
		initMainSaveBtn()
	})
})