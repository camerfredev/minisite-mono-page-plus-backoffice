ParamsManagment = {
	//parametres du site donnés en json
	params: siteParams,
	//petit drapeau pour dire si on doit afficher le toast de rappel pour sauvegarder
	showToastIfNeeded: true,
	//rendu du formulaire d'edition des parametres du site
	render() {
		let htmlToInclude = `
		<form class="col s12 relative" id="siteParamsForm" >

		<div class="row no-margin">
					<div class="col s12">
						<div class="row card light-shadow center-align" style="background-color: white; padding: 30px !important;">

							<div class="switch relative">
								<label class="row no-margin relative" style="left: -27px !important;">
								<span class="grey-text text-darken-2" style="font-size: 1.2em !important;">Mode maintenance</span>
								<input type="checkbox" id="isPublished" value="true" `
					if (this.params.isPublished){
					htmlToInclude += 'checked'
					}
					htmlToInclude += `>
								<span class="lever"></span>
								<span class="grey-text text-darken-2" style="font-size: 1.2em !important;">Site visible</span>
								</label>
							</div>

						</div>
					</div>
				</div>
			<div class="row">
				<div class="col s12 l6">
					<div class="row card light-shadow" style="background-color: white; padding: 30px !important; min-height: 460px !important;">
						<div class="row">
							<h5 class="center-align grey-text text-darken-2">Personaliser l'affichage</h5>
						</div>


						<div class="input-field col s12 tooltipped" data-position="top"
									 data-delay="350" data-tooltip="Modifier le nom de votre site (son adresse restera identique, seul le nom visible par les utilisateurs sera remplacé)">
							<input id="siteName" name="siteName" type="text" required class="validate" value="` + this.params.title + `">
							<label for="siteName">Intitulé du site à afficher</label>
						</div>
						<div class="input-field col s12 tooltipped" data-position="top"
									 data-delay="350" data-tooltip="Augmenter ou réduire la taille de votre titre">
							<select id="titleSize" >
								<option class="grey-text text-darken-2" value="large" ` + this.autoSelect(this.params.titleSize, 'large') + `>Grand</option>
								<option class="grey-text text-darken-2" value="medium" ` + this.autoSelect(this.params.titleSize, 'medium') + `>Moyen</option>
								<option class="grey-text text-darken-2" value="small" ` + this.autoSelect(this.params.titleSize, 'small') + `>Petit</option>
								<option class="grey-text text-darken-2" value="none" ` + this.autoSelect(this.params.titleSize, 'none') + `>Ne pas afficher</option>
							</select>
							<label>Taille du titre</label>
						</div>
						<div class="col s12">
							<div class="row">
								<div class="col s6 ">
									<p class="grey-text center-align" style="font-size: 0.8em">Image d'onglet</p>
									<p class="center-align relative" >
										<input type="text" class="displaynone" name="favIcon" value="${this.params.favIcon}">
										<img id="siteParams-favIcon" class="center-align siteParamsChangeImage tooltipped"
										 data-position="top" data-delay="350" data-tooltip="Petite icône située dans l'onglet du navigateur (il peut arriver que le navigateur garde en mémoire l'image malgré sa suppression), taille recommandée : 40x40 px"
										 style="width: 60px !important;height: 60px !important; cursor: pointer" src="` + this.imgOrDefault(this.params.favIcon) + `" alt="">
										`
		if (this.params.favIcon) {
			htmlToInclude += `				<a  href="#!" class="btn-floating waves-effect waves-light lightButton absolute tooltipped "   data-position="top"
															data-delay="350" data-tooltip="retirer" style="top: -27px; right: 20px; " id="removeFavIcon">
											<i class="material-icons">clear</i>
										</a>`
		}
		htmlToInclude += `
									</p>
								</div>
								<div class="col s6 ">
									<p class="grey-text center-align " style="font-size: 0.8em">Logo</p>
									<p class="center-align relative" >
										<input type="text" class="displaynone" name="siteLogo" value="${this.params.siteLogo}">
										<img id="siteParams-siteLogo" class="center-align siteParamsChangeImage tooltipped"
										 data-position="top" data-delay="350" data-tooltip="Logo visible à coté du titre de votre site, taille recommandée : 100x100 px"
										 style="width: 60px !important;height: 60px !important; cursor: pointer" src="` + this.imgOrDefault(this.params.siteLogo) + `" alt="">
															`
		if (this.params.siteLogo) {
			htmlToInclude += `				<a  href="#!" class="btn-floating waves-effect waves-light lightButton absolute tooltipped "   data-position="top"
															data-delay="350" data-tooltip="retirer" style="top: -27px; right: 20px; " id="removeSiteLogo">
											<i class="material-icons">clear</i>
										</a>`
		}
		htmlToInclude += `
									</p>

								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col s12 l6">
					<div class="row card light-shadow" style="background-color: white; padding: 30px !important; min-height: 460px !important;">
						<div class="row">
							<h5 class="center-align grey-text text-darken-2">Optimiser le référencement </h5>
						</div>
						<div class="input-field col s12 tooltipped" data-position="top"
									 data-delay="350" data-tooltip="Indiquez la langue du contenu de votre site">
								<select id="lang" >
									<option class="grey-text text-darken-2" value="fr_FR" ` + this.autoSelect(this.params.lang, 'fr_FR') + `>Français</option>
									<option class="grey-text text-darken-2" value="en_EN" ` + this.autoSelect(this.params.lang, 'en_EN') + `>English</option>
								</select>
								<label>Language du contenu</label>
						</div>
						<div class="input-field col s12 tooltipped" data-position="top"
									 data-delay="350" data-tooltip="Texte affiché par la plupart des moteurs de recherche">
							<textarea id="description" class="materialize-textarea" placeholder="Entrez ici un texte qui sera affiché sous le nom de votre site dans les moteurs de recherche"></textarea>
							<label for="description">Description du site</label>
						</div>
						<div class="input-field col s12 tooltipped" data-position="top"
									 data-delay="350" data-tooltip="Mots clef utilisés par certains moteurs de recherche pour referencer votre site">
							<div id="keywords" class="chips"></div>
							<label for="keywords">Mots clefs</label>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col s12 center-align" style="margin-top: 20px !important;">
						<button id="submitParamsBtn" type="submit" class="light-shadow fixed btn-large frama-orange hover-frama-purple waves-effect waves-light btn" style="top: 126px ; right: 35px"><i class="material-icons white-text right">save</i>Enregistrer</button>
					</div>
				</div>
			</form>
		`
		//on l'inserde dans le dom, puis on initialise les events liés a son contenu
		$('#paramsManagment').html(htmlToInclude)
		setTimeout(() => {
			this.initFormEvents()
			//this.initCounter()
		}, 300)
	},
	//renvoie l'image par défaut si ya rien (le "?" )
	imgOrDefault(url) {
		if (url) {
			return url
		} else {
			return "public/img/no-logo.png"
		}
	},
	//renvoie selected si la value correspond a la valeur actuelle des paramps de l'utilisateur
	autoSelect(inputName, value) {
		if (inputName === value) {
			return " selected "
		}
	},
	//initialisation des events du formulaire
	initFormEvents() {
		let that = this;
		//plein  de petites fonctions pour initialiser le champs avec materialize
		Materialize.updateTextFields();
		$('select').material_select();
		$('#description').val(this.params.description);
		$('#description').trigger('autoresize');
		let keywords = this.params.keywords.split(", ")
		let chipData = []
		keywords.forEach((keyword) => {
			chipData.push({tag: keyword})
		})
		$('#keywords').material_chip({
			data: chipData,
			placeholder: 'ajouter un mot clef',
			secondaryPlaceholder: 'ajouter',
		});
		//lorsque le form est soumis on fait rien
		$('#siteParamsForm').submit(function (e) {
			e.preventDefault()
		})
		//lorsqu'on clique sur une image
		$('.siteParamsChangeImage').click(function () {
			//on passe a l'onglet media
			let id = this.id.split("-")[1]
			$("a[href=#options-medias]").click()
			MediaManagment.render(true, "uglyForm-" + id + "-imgUrl")

		})
		//events indiquants un changement réalisé par l'utilisateur
		$('#siteParamsForm input').change(function () {
			that.dontForgetToSave()
		})
		$('.chips').on('chip.add', function (e, chip) {
			that.dontForgetToSave()
		});

		$('.chips').on('chip.delete', function (e, chip) {
			that.dontForgetToSave()
		});
		//supression du logo du site
		$('#removeSiteLogo').click(function () {
			$('#siteParamsForm input[name=siteLogo]').val("").change()
			$('#siteParams-siteLogo').attr('src', that.imgOrDefault(""))

		})
		//supression du l'icone du site
		$('#removeFavIcon').click(function () {
			$('#siteParamsForm input[name=favIcon]').val("").change()
			$('#siteParams-favIcon').attr('src', that.imgOrDefault(""))
		})
		//lorsqu'on clique sur envoyer
		$('#submitParamsBtn').click(function () {
			//on vien récuperer les données du formulaire
			let data = that.getFormValues()
			//et on fait la requete ajax
			$.ajax({
				url: 'admin/edit/edit-params',
				type: 'POST', // Le type de la requête HTTP, ici devenu POST
				data: data, //
				dataType: 'json',
				success(msg) {
					console.log()
					if (msg.result === "success") {//si ca marche
						$('.tooltipped').tooltip({delay: 50});
						//et on recharge la page parceque c'est plus simple que te tout changer,
						//on le fait en soumettant le formulaire principal des modules comme ca les changement de l'utilisateur non pris en compte le seront'
						$('#uglyForm').submit()

					} else {
						console.log(msg)
						Materialize.toast("Une erreur s'est produite", 4000, 'red')
						$('.tooltipped').tooltip({delay: 50});
					}
				},
				error: function () {
					Materialize.toast("Une erreur s'est produite", 4000, 'red')
					$('.tooltipped').tooltip({delay: 50});

				}
			})
		})

	},
	//affichage d'une petite notif et clignotage du bouton pour indiquer a l'utilisateur qu'il doit sauvegarder
	dontForgetToSave() {
		if (this.showToastIfNeeded) {
			Materialize.toast('Cliquer sur enregistrer pour que les changements soient appliqués', 4000)
		}
		this.showToastIfNeeded = false
		$('#submitParamsBtn').addClass('pulse')
	},
	//récuperation des valeurs du formulaire
	getFormValues() {
		let data = ""
		//on commence par le CSRF
		data += 'CSRFToken=' + CSRFToken
		//pui on recupere les valeurs des champs
		let submittedValues = {
			isPublished: $('#siteParamsForm #isPublished:checked').val() ? $('#siteParamsForm #isPublished:checked').val() : "",
			title: $('#siteParamsForm #siteName').val(),
			titleSize: $('#siteParamsForm #titleSize').val(),
			favIcon: $('#siteParamsForm input[name=favIcon]').val(),
			siteLogo: $('#siteParamsForm input[name=siteLogo]').val(),
			lang: $('#siteParamsForm #lang').val(),
			description: $('#siteParamsForm #description').val(),
			framalink: $('#siteParamsForm input[name=framalink]').val(),
		}
		for (key in submittedValues) {
			data += "&" + key + "=" + submittedValues[key];
		}
		//on récupere aussi les tags
		let keywords = ""
		let tags = $('#siteParamsForm #keywords').material_chip('data')
		tags.forEach((tag, i) => {
			if (i !== tags.length - 1) {
				keywords += tag.tag + ", "
			} else {
				keywords += tag.tag
			}

		});
		data += "&keywords=" + keywords;
		//et on renvoie les données
		return data;
	},
	// initCounter(){
	// 	if(this.params.framalink){
	//
	// 	}else{
	// 		let url=window.location.href
	// 		let arr = url.split("/");
	// 		let pixelUrl = ""
	// 		if(url.split(':')[0] === "localhost"){
	// 			pixelUrl = arr[0]
	// 		}else{
	//
	// 			pixelUrl = arr[0] + "//" + arr[2]
	// 		}
	// 		pixelUrl += "/public/img/1px.gif"
	//
	// 		$.post( "https://frama.site/lstu/a", { lsturl: pixelUrl, format: "json" } , (data)=>{
	// 			console.log(data)
	// 		});
	// 	}
	// }

}

$(document).ready(function () {
	//au chargement de la page on y insere le tout
	ParamsManagment.render();
})
