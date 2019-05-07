$(document).ready(function () {
// the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
	$('#addSectionModal').modal();

	//au click sur inerer une section
	$('.addSectionBtn').click(function () {
		//on récupere toutes les infos stockées dans l'id du boutton
		let splittedId = this.id.split("-")
		//et on remplit le formulaire caché avec
		$('#addSectionForm input[name = positionReference]').val(splittedId[1])
		$('#addSectionForm input[name = reference]').val(splittedId[2])
		$('#addSectionForm input[name = hash]').val(splittedId[2])
	})

	//au click sur le le module choisi
	$('.chooseModuleBtn').click(function () {
		//on viens récurer le nom du module choisi pour le rentrer dans le formulaire
		$('#addSectionForm input[name = module]').val(this.id.split("-")[1])
		setTimeout(function () {//on attends un peu pour etre sur que c'est fait
			//et on soumet le formulaire
			$('#addSectionForm').submit()
		}, 50)
	})

	ModuleSelector.render()
});

ModuleSelector = {
	isFirstRender:true,
	isShowAll: true,
	tags: [
		{
			value: 'moduleTag-text',
			icon: 'text_fields',
			label: 'modules avec contenu textuel',
			isSelected: false
		},
		{
			value: 'moduleTag-img',
			icon: 'photo',
			label: 'modules avec images',
			isSelected: false
		},
		{
			value: 'moduleTag-video',
			icon: 'play_circle_filled',
			label: 'modules avec contenu audio-visuel',
			isSelected: false
		},
		{
			value: 'moduleTag-special',
			icon: 'polymer',
			label: 'Modules spéciaux',
			isSelected: false
		},
		{
			value: 'moduleTag-animated',
			icon: 'compare_arrows',
			label: 'modules avec animations',
			isSelected: false
		},
		{
			value: "moduleTag-cv",
			icon: 'perm_identity',
			label: "modules adaptés à la réalisation d'un CV",
			isSelected: false
		}
	],
	btnHtml(tag) {
		return `<a class="btn-floating module-tag grey relative lighten-2 ${tag.isSelected ? 'border-orange-tag' : ''} tooltipped waves-effect waves-light selectTagBtn" data-position="bottom"
					   data-delay="150" data-tooltip="${tag.isSelected ? 'Retirer' : 'Ajouter'} les ${tag.label} ${tag.isSelected ? 'de' : 'à'} votre sélection" id="tag~${tag.value}">
						<i class="material-icons relative grey-text text-darken-3 ">${tag.icon}</i>
					</a>`


	},
	btnAll() {
		return `<a class=" btn-floating frama-orange hover-frama-purple  tooltipped waves-effect waves-light selectTagToggleBtn" data-position="bottom"
					   data-delay="150" data-tooltip="${this.isShowAll ? 'Désélectionner tout' : 'Sélectionner tout'}" id="${this.isShowAll ? 'deselectAllTags' : 'selectAllTags'}">
						<i class="material-icons  white-text">${this.isShowAll ? 'grid_off' : 'grid_on'}</i>
					</a>`


	},
	renderBtns() {
		let htmlToInclude = "<ul>"
		htmlToInclude += "<li style='padding-right: 15px'>"
		htmlToInclude += this.btnAll()
		htmlToInclude += "</li>"
		this.tags.forEach((tag) => {
			htmlToInclude += "<li>"
			htmlToInclude += this.btnHtml(tag)
			htmlToInclude += "</li>"
		})
		htmlToInclude += "</ul>"
		$('#tagsContainer').html(htmlToInclude)

		setTimeout(() => {
			this.initEvents()
		}, 150)
	},
	initEvents() {
		let that = this
		$('.selectTagBtn').click(function () {
			let tagValue = this.id.split('~')[1]
			that.tags.forEach((tag, i) => {
				if (tag.value === tagValue) {
					that.tags[i].isSelected = !that.tags[i].isSelected
				}
			})
			that.render()
		})
		$('.selectTagToggleBtn').click(function () {
			that.tags.forEach((tag, i) => {
				if (this.id === 'selectAllTags') {
					that.tags[i].isSelected = true
				} else {
					that.tags[i].isSelected = false
				}
			})
			that.isShowAll = !that.isShowAll
			that.render()
		})
		$('.to').click(function () {
		})
	},
	applySelectors() {
		$('.moduleSelectorContainer').hide()
		this.tags.forEach((tag) => {
			if (tag.isSelected) {
				$('.' + tag.value).show()
			}
		})
	},
	render() {
		$('.tooltipped').tooltip('remove');
		this.renderBtns()
		if(!this.isFirstRender){
			this.applySelectors()

		}
		this.isFirstRender = false;
		setTimeout(() => {
			$('.tooltipped').tooltip({delay: 50});
		}, 300)
	}

}