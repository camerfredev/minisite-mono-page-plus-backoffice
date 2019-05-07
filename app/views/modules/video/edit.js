$(document).ready(function () {
	getVideoId = function (type,url) {
		if(type === "youtube"){
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);

			if (match && match[2].length == 11) {
				return match[2];
			} else {
				return 'error';
			}
		}else if(type === "peertube"){

		return(url.split('/')[5])

		}else if(type === "vimeo") {
			return (url.split('/')[3])
		}
	}
	getInstance = function (url) {
		return(url.split('/')[2])

	}
	$('.editVideoModal').modal()
	$('.editVideoForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let videoType = $('#editVideoForm-' + sectionId + " select[name=videoType]").val()
		let videoUrl = $('#editVideoForm-' + sectionId + " input[name=videoUrl]").val()

		let videoId = getVideoId(videoType, videoUrl)
                let instance = getInstance(videoUrl)
		if(videoType === 'youtube'){
			$('#videoContainer-'+sectionId).html('<iframe width="560" height="315" src="//www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
		}else if(videoType === 'peertube'){
                        //let instance = getInstance(videoUrl)
			$('#videoContainer-'+sectionId).html('<iframe width="560" height="315" src="https://' + instance + '/videos/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>');
		}else if(videoType === "vimeo"){
			$('#videoContainer-'+sectionId).html('<iframe src="https://player.vimeo.com/video/' + videoId + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
		}

		$('#uglyForm input[name=uglyForm-' + sectionId + '-videoType]').val(videoType)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-videoId]').val(videoId)
                $('#uglyForm input[name=uglyForm-' + sectionId + '-instance]').val(instance)
		// $('#videoTypeModuleVideo-'+sectionId).html(label)
		// $('#videoModuleBtn-'+sectionId).attr('href', videoUrl)
		$('.editVideoModal').modal('close')
		initMainSaveBtn()
	})
})