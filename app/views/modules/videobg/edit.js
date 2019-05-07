$(document).ready(function () {
	getVideobgId = function (type,url) {
		if(type === "youtube"){
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);

			if (match ) {
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
	$('.editVideobgModal').modal()
	$('.selectFilter').click(function () {
		let sectionId = this.id.split('-')[1]
		let filter = this.id.split('-')[3]
		$('#'+sectionId+' .selectFilter').css('border', 'none')
		$(this).css('border', '4px solid #C48A1B')
		$('#editVideobgForm-' + sectionId + " select[name=VideobgFilter]").val('filter-'+filter)

	})
	$('.editVideobgForm').submit(function (e) {
		console.log('coucou')
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let VideobgFilter = $('#editVideobgForm-' + sectionId + " select[name=VideobgFilter]").val()
		let VideobgUrl = $('#editVideobgForm-' + sectionId + " input[name=VideobgUrl]").val()
		let VideobgId = getVideobgId("youtube", VideobgUrl)
			console.log(VideobgId)
		$('#VideobgContainer-' + sectionId).html('<iframe width="560" height="315" src="//www.youtube.com/embed/'+VideobgId+'?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist='+VideobgId+'" frameborder="0" allowfullscreen></iframe>');
		$('#VideobgFilter-'+ sectionId).attr('class', 'screen '+ VideobgFilter)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-filter]').val(VideobgFilter)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-VideobgId]').val(VideobgId)
		$('.editVideobgModal').modal('close')
		initMainSaveBtn()
	})
})