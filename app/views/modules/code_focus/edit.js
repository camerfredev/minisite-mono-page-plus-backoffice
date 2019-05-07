$(document).ready(function () {
	$('.editCodeModal').modal()
	$('.editCodeForm').submit(function (e) {
		e.preventDefault()
		let sectionId = this.id.split('-')[1]
		let language = $('#editCodeForm-' + sectionId + " select[name=language]").val().toLowerCase()

			$('#moduleValue-content').attr('class' , ' editable codeHiglight light-shadow '+ language)

		$('#uglyForm input[name=uglyForm-' + sectionId + '-language]').val(language)
		setTimeout(()=>{
			$('pre code').each(function(i, block) {
				hljs.highlightBlock(block);
			});
		}, 200)
		$('.editCodeModal').modal('close')
		initMainSaveBtn()
	})
})