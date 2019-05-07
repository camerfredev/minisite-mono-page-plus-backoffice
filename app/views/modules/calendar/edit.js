$(document).ready(function () {
	getAgendaId = function (type,url) {
		console.log(url)
		console.log(type)
		if(type === "framagenda"){
		return url.split("/p/")[1].split('/')[0]
		}else if(type === "google calendar"){
			return url.split("?src=")[1]
		}
	}
	$('.editAgendaModal').modal()
	$('.editAgendaForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let AgendaType = $('#editAgendaForm-' + sectionId + " select[name=agendaType]").val()
		let AgendaUrl = $('#editAgendaForm-' + sectionId + " input[name=agendaUrl]").val()

		let AgendaId = getAgendaId(AgendaType, AgendaUrl)
		console.log(AgendaId)
		if(AgendaId){
			if(AgendaType === 'google calendar'){
				$('#agendaContainer-'+sectionId).html(
				'<iframe src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=400&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=' + AgendaId + '&amp;color=%230F4B38&amp" style="border-width:0" width="800" height="400" frameborder="0" scrolling="no"></iframe>'
				);
			}else if(AgendaType === 'framagenda'){
				$('#agendaContainer-'+sectionId).html(
					'<iframe width="400" height="215" src="https://framagenda.org/index.php/apps/calendar/embed/' + AgendaId + '"></iframe>'
				);
			}

			$('#uglyForm input[name=uglyForm-' + sectionId + '-agendaType]').val(AgendaType)
			$('#uglyForm input[name=uglyForm-' + sectionId + '-agendaId]').val(AgendaId)
			// $('#videoTypeModuleVideo-'+sectionId).html(label)
			// $('#videoModuleBtn-'+sectionId).attr('href', videoUrl)
			$('.editAgendaModal').modal('close')
			initMainSaveBtn()
		}else{
			$('#errorAgenda-' + sectionId).html("le lien fourni n'est pas valide")
		}

	})
})