$(document).ready(function () {
	getAudioUrl = function (type,iframe) {
		if(type === "soundcloud"){

			let secondPart = iframe.split('src="')[1]

			return secondPart.split('"')[0]
		}
	}
	$('.editAudioModal').modal()
	$('.editAudioForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let audioType = $('#editAudioForm-' + sectionId + " select[name=audioType]").val()
		let audioIframe = $('#editAudioForm-' + sectionId + " input[name=audioIframe]").val()
console.log(audioIframe)
		let audioUrl = getAudioUrl(audioType, audioIframe)
		if(audioType === 'soundcloud') {
			$('#audioContainer-' + sectionId).html('<iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="' + audioUrl + '"></iframe>')
		}
		console.log(audioIframe)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-audioType]').val(audioType)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-audioUrl]').val(audioUrl)
		// $('#videoTypeModuleVideo-'+sectionId).html(label)
		// $('#videoModuleBtn-'+sectionId).attr('href', videoUrl)
		$('.editAudioModal').modal('close')
		initMainSaveBtn()
	})
})