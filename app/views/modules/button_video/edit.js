$(document).ready(function () {
	getVideobgId = function (type,url) {
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
	$('.editBtnVideobgModal').modal()
	$('.selectFilter').click(function () {
		let sectionId = this.id.split('-')[1]
		let filter = this.id.split('-')[3]
		$('#'+sectionId+' .selectFilter').css('border', 'none')
		$(this).css('border', '4px solid #C48A1B')
		$('#editBtnVideobg-' + sectionId + " select[name=VideobgFilter]").val('filter-'+filter)

	})
	$('.editBtnVideobg').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let VideobgFilter = $('#editBtnVideobg-' + sectionId + " select[name=VideobgFilter]").val()
		let VideobgUrl = $('#editBtnVideobg-' + sectionId + " input[name=VideobgUrl]").val()
		let VideobgId = getVideobgId("youtube", VideobgUrl)
		$('#VideobgContainer-' + sectionId).html('<iframe width="560" height="315" src="//www.youtube.com/embed/'+VideobgId+'?controls=0&showinfo=0&rel=0&autoplay=1&mute=1&loop=1&playlist='+VideobgId+'" frameborder="0" allowfullscreen></iframe>');
		$('#VideobgFilter-'+ sectionId).attr('class', 'screen '+ VideobgFilter)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-filter]').val(VideobgFilter)
		$('#uglyForm input[name=uglyForm-' + sectionId + '-VideobgId]').val(VideobgId)
		$('.editBtnVideobgModal').modal('close')
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