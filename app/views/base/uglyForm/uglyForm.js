let saveBtnOpen = false
initMainSaveBtn = function () {
	if(!saveBtnOpen){
		window.onbeforeunload = function () {
			let message = "certains changements ne sont pas sauvegardés, cliquer sur le bouton en haut à droite pour les enregistrer"

			return message;
		}
		let saveBtn = $('#saveBtn')
		$('.addSectionBtn, .generalMenuOptionsBtn').click(function (e) {
			e.preventDefault()
			if (confirm("Vos changements sur la page doivent être enregistré avant de pouvoir modifier la structure du site. Cliquez sur OK pour les enregistrer")) {
				saveBtn.click()
			} else {

			}
		})
		//on affiche le bouton sauvegarder en bas a droite
		saveBtn.css('visibility', 'visible')
		saveBtn.click(function () {
			window.onbeforeunload = function () {}
			$('.editable').each(function () {
				let zoneId= this.id.split("-")[1]
				let sectionId = $(this).closest("section").attr('id')
				let formatedContent = $(this).html()
				let uglyFormInput = $("#uglyForm input[name=uglyForm-" + sectionId +"-"+ zoneId + "]")
				uglyFormInput.val(formatedContent)
			})
			let scrolled = document.documentElement.scrollTop
			let visibleSectionId = ""
			$('section').each(function () {
				if(this.offsetTop>scrolled -200 && !visibleSectionId){
					visibleSectionId = this.id

				}
			})
			$('#uglyForm input[name = hash]').val(visibleSectionId)
			$('#uglyForm').submit()

		});
		saveBtnOpen = true
	}

}

$(document).ready(function () {
	//lorsqu'une action viens modifier le formulaire de réference contenant les infos de la page
	$('#uglyForm input').change(function () {

		//on vient modifier le html dans les modules correspondants
		let splittedName = this.name.split("-") //l'input[name] est du type "uglyForm-5a5a14305795a-imgUrl"
		//on viens récuperer la div correspondante a l'input grace a son id
		let toChange = $("#" + splittedName[1] + " #moduleValue-" + splittedName[2])
			toChange.attr('src', this.value)


		initMainSaveBtn()


	})
})