/************************
 * Objet permettant l'affichage de la bibliotheque d'media
 * @type {{files(): *, initialFiles, recentlyAddedFiles: Array, onlyForPickUp: boolean, addButon: string, waitingSpinner: string, getHtmlItem(*): *, initAddFileEvent(): void, render(*=): void, initAddFiles(): void, addFileCallback(*=): void}}
 */
MediaManagment = {
	//les fichier a partir desquels doit travailler l'objet pour le rendus
	medias() {
		return this.recentlyAddedMedias.concat(this.initialMedias)
	},
	//liste des fichiers donnés en json
	initialMedias: initialMedias,
	//liste des fichiers que vient de rajouter l'utilisateur
	recentlyAddedMedias: [],
	//true si on est en mode selection d'media à inserer dans le template
	onlyForPickUp: false,
	uglyFormInputName: "",
	uploadCrop: null,
	//bouton d'aijout d'une nouvelle media
	addButon: `<a href="#!" class=" light-shadow columnItem" id="addMediaToLibrary" style="background-color: rgb(255,255,255) !important;">
						<div class=" light-shadow hoverBorderInBox tooltipped" data-position="top"
							 data-delay="350" data-tooltip="Ajouter une image à votre bibliothèque, taille limite : 2Mo" style="text-align: center; background-color: rgb(255,255,255) !important; margin: 0 10px 0px 10px !important; ">
							<i class="material-icons frama-orange-text  lighten-2 large" style="margin: 50px">add</i>
						</div>
					</a>`
	,
	//spinner d'attente
	waitingSpinner: `<div  class="card light-shadow columnItem"  style="background-color: rgb(255,255,255) !important;">
					<div class="card-content light-shadow borderInBox tooltipped" data-position="top"
						 data-delay="350" data-tooltip="Ajouter une image à votre bibliothèque" style="text-align: center; background-color: rgb(255,255,255) !important;  margin-bottom: 20px !important;">
							   <div class="preloader-wrapper big active center-align">
									<div class="spinner-layer spinner-yellow-only">
										  <div class="circle-clipper left">
												<div class="circle"></div>
										  </div><div class="gap-patch">
												<div class="circle"></div>
										  </div><div class="circle-clipper right">
												<div class="circle"></div>
										  </div>
									</div>
							   </div>
					</div>
				</div>`
	,
	//template de l'affichage d'une media seule
	getHtmlItem(media) {
		let htmlToInsert = ""
		htmlToInsert += `
			<section class="blockList relative parent-hover">
			<a href="#!" id="admin/edit/delete-media?id=` + media.id + `&CSRFToken=` + CSRFToken + `" class="children-hover btn-floating
					waves-effect waves-light lightButton absolute tooltipped removeMediaFromLibrary " data-position="top"
								 data-delay="350" data-tooltip="Supprimer l'image de votre bibliothèque"
								 style="top: 10px ; right: 20px; z-index: 10000">
						<i class="material-icons " >delete</i>
					</a>
				<div class=" light-shadow relative  columnItem `
		//si c'esst pour une selection on affiche aussi le tooltip et la classe
		htmlToInsert += this.onlyForPickUp ? " hoverBorderInBox2 pickUpImageToUglyForm tooltipped\" data-position=\"bottom\" data-delay=\"350\" data-tooltip=\"Choisir cette image\"" : ""
		htmlToInsert += `"
				 style="background-color: rgb(255,255,255) !important;">
					<i class="absolute white-text " style="margin:20px 0 0 10px; font-size: small">` + media.size + `</i>
					<img class="responsive-img" src="` + media.url + `" alt="` + media.label + `">

					<div class="absolute children-hover `
		htmlToInsert += this.onlyForPickUp ? 'displaynone' : '';
		htmlToInsert += `" style="bottom: 0; width: 100%; background-color: rgba(0,0,0,0.52)">
						<form method="post" action="admin/edit/edit-media-info" class="editMediaInfo" style="margin: 0 10px 0 10px !important;">
						<input type="text" name="id" value="` + media.id + `" class="displaynone">
						<input type="text" class="displaynone" name="CSRFToken" value="` + CSRFToken + `">
							<input name="label" type="text" `
		//form de la valeur "alt"
		htmlToInsert += media.label ? 'value="' + media.label + '"' : "";
		htmlToInsert += `  placeholder="Donner un titre a votre image" class="tooltipped white-text" data-position="bottom"
						data-delay="350" data-tooltip="Editer le nom de votre image, utile pour l'accessibilité de votre site et son référencent" style="width: 100%; margin-bottom: 10px!important; ">

							<button class=" btn-floating  waves-effect waves-light lightButton absolute tooltipped" data-position="top"
									 data-delay="350" data-tooltip="Editer"
									 style="top: -10px ; right: 10px">
								<i class="material-icons " >edit</i>
							</button>
						</form>
					</div>
				</div>
			</section>`
		//et on renvoie le template
		return htmlToInsert
	},
	//methode d'initialisation des events liés au templates
	initAddMediaEvent() {
		let that = this
		//ajout d'medias à la librairie
		$('#addMediaToLibrary').click(function () {
			let $addMediaForm = $('#addMediaForm input[type=file]')
			$addMediaForm.click()
			$addMediaForm.change(function () {
				$('#modalCroppingImage').modal('open')
				var reader = new FileReader();
				reader.onload = function (e) {
					that.uploadCrop.croppie('bind', {
						url: e.target.result
					}).then(function () {
						console.log('jQuery bind complete');
					});

				}
				reader.readAsDataURL(this.files[0]);
			});
		})
		$('#rotateImg').click(function () {
			that.uploadCrop.croppie("rotate", 90)
		})
		$('#saveImageCropped').click(function () {
			that.uploadCrop.croppie('result', {
				type: 'blob',
				size: 'original',
				format: "png",
				quality: 0.6

			}).then(function (resp) {
				// console.log(resp)
				// var array = [];
				// for(var i = 0; i < resp.length; i++) {
				// 	array.push(resp.charCodeAt(i));
				// }
				// resp.ext = 'png'
				// resp.name='toupload.png'
				var file = resp;
				console.log(file)
				var formdata = new FormData();
				formdata.append("media", file);
				formdata.append("CSRFToken", CSRFToken)
				$.ajax({
					url: "admin/edit/add-media-to-librairie",
					type: "POST",
					data: formdata,
					async: false,
					success(msg) {
						console.log(msg)
						let parsedMsg = JSON.parse(msg)
						if (parsedMsg.errorMsg) {
							console.log(parsedMsg)
							Materialize.toast(parsedMsg.errorMsg, 4000, 'red')
							that.render()
						} else {
							//appel de la fonction gérant tout les callbacks de l'ajout d'image
							that.addMediaCallback(parsedMsg)
						}
					},
					cache: false,
					contentType: false,
					processData: false
				});

			})
		});

		$('#saveImageNormal').click(function () {
			$("#addMediaForm").submit()
		})
		$("#addMediaForm").submit(function (e) {
			e.preventDefault();
			that.initAddMedias()
			let formData = new FormData($(this)[0]);
			$.ajax({
				url: "admin/edit/add-media-to-librairie",
				type: "POST",
				data: formData,
				async: false,
				success(msg) {
					let parsedMsg = JSON.parse(msg)
					if (parsedMsg.errorMsg) {
						console.log(parsedMsg)
						Materialize.toast(parsedMsg.errorMsg, 4000, 'red')
						that.render()
					} else {
						//appel de la fonction gérant tout les callbacks de l'ajout d'image
						that.addMediaCallback(parsedMsg)
					}
				},
				cache: false,
				contentType: false,
				processData: false
			})
		})
		//supression de medias
		$('.removeMediaFromLibrary').click(function (e) {
			e.preventDefault();
			let url = this.id;
			$.getJSON(url, (response) => {
				if (!response.deletedId) {
					Materialize.toast("Une erreur s'est produite", 4000, 'red')
					$('.tooltipped').tooltip({delay: 50});
				} else {
					that.removeMedia(response.deletedId)
				}

			})
		})
		//action au click sur le bouton d'eition d'une image
		$('.editMediaInfo').submit(function (e) {
			var url = "admin/edit/edit-media-info"; // the script where you handle the form input.
			$('.tooltipped').tooltip('remove');
			$.ajax({
				type: "POST",
				url: url,
				data: $(this).serialize(), // serializes the form's elements.
				success: function (data) {
					let response = JSON.parse(data)
					that.editMediaInfo(response.id, response.label)
					$('.tooltipped').tooltip({delay: 50});
				},
				error: function () {
					Materialize.toast("Une erreur s'est produite", 4000, 'red')
					$('.tooltipped').tooltip({delay: 50});
				}
			});

			e.preventDefault();
		})
		//actions à réaliser lorsqu'une image est selectionnée pour faire partie d'un module
		if (this.onlyForPickUp) {
			$(".pickUpImageToUglyForm").click(function () {
				//on récupere l'url de l'image
				let imgUrl = $(this).find('img').attr("src")
				//si on est dans le cas classique d'une modif d'image d'un module
				if (that.uglyFormInputName !== "uglyForm-siteLogo-imgUrl" && that.uglyFormInputName !== "uglyForm-favIcon-imgUrl") {
					//on l'insere dans l'input correspondant
					let uglyFormInput = $("#uglyForm input[name=" + that.uglyFormInputName + "]")
					uglyFormInput.val(imgUrl)
					//on referme la modale et on réinitialise
					$("#siteOptionsModal").modal('close');
					that.onlyForPickUp = false
					that.uglyFormInputName = ""
					uglyFormInput.change()
				} else { //sinon c'est quon modifie le logo du site ou son favicon
					//on l'insere dans l'input correspondant
					let input = $("#siteParamsForm input[name=" + that.uglyFormInputName.split('-')[1] + "]")
					input.val(imgUrl)
					input.change()
					$('#siteParams-' + that.uglyFormInputName.split('-')[1]).attr('src', imgUrl)
					$('#siteParamsForm input').change()
					that.onlyForPickUp = false
					that.uglyFormInputName = ""
					$("a[href=#options-params]").click()
				}


			})
		}

	},
	//methode de callback appelée apres le succes d'un appel ajax de suppression
	removeMedia(id) {
		//on la recherche dans les deux tables, on la supprime, puis on re-rends le template
		$('.tooltipped').tooltip('remove');
		this.initialMedias.forEach((media, i) => {
			console.log(media.id)
			if (media.id === id) {
				this.initialMedias.splice(i, 1)
			}
		});
		this.recentlyAddedMedias.forEach((media, i) => {
			if (media.id === id) {
				this.recentlyAddedMedias.splice(i, 1)
			}
		})
		this.render()
	},
	//methode de callback appelée au succes d'une requete ajax d'édition
	editMediaInfo(id, label) {
		//on cherche dans les deux tables, on fait la modif comme en base,  puis on re-rends le template
		this.initialMedias.forEach((media, i) => {
			console.log(media.id)
			if (media.id === id) {
				this.initialMedias[i].label = label
			}
		});
		this.recentlyAddedMedias.forEach((media, i) => {
			if (media.id === id) {
				this.recentlyAddedMedias[i].label = label
			}
		})
		this.render()

	},
	/*********************************
	 * Rendu du template general
	 * @param onlyForPickUp //true si on veut que la page soit en mode selection d'image
	 */
	render(onlyForPickUp, uglyFormInputName) {

		$('.tooltipped').tooltip('remove');
		//si ya quelquechose de rentré, on le passe (utile pour la selection d'image)
		if (typeof onlyForPickUp !== 'undefined') {
			this.onlyForPickUp = onlyForPickUp
		}
		if (typeof uglyFormInputName !== 'undefined') {
			this.uglyFormInputName = uglyFormInputName
		}
		let htmlToInsert = ""
		//ajout du bouton d'ajout
		htmlToInsert += `<section class="blockList" id="addNewMediaToListContainer" >` +
			this.addButon + `</section>
						<form id="addMediaForm" action="#!" class="displaynone">
							<input type="text" class="displaynone" name="CSRFToken" value="` + CSRFToken + `">
							<input type="file" name="media" accept="image/*">
						</form>


`
		$('#croppingModalContainer').html(`		<div class="absolute modal-close" style="right : 20px; top: 20px; z-index: 7000">
			<a href="#!" id="saveImageCropped"  class=" btn btn-large white-text frama-orange hover-frama-purple  waves-effect waves-green "><i class="material-icons right no-margin">crop</i><span class="hide-on-med-and-down" style="margin-right: 15px;">Enregister l'image modifiée</span></a>
		</div>
		<div class="absolute modal-close" style="left : 20px; top: 20px; z-index: 7000">
			<a href="#!" id="saveImageNormal"  class=" btn btn-large white-text  frama-orange hover-frama-purple  waves-effect waves-green "><i class="material-icons left no-margin">save</i><span class="hide-on-med-and-down" style="margin-left: 15px;">Enregister l'image originale</span></a>
		</div>
		<div class="absolute " style="right : 20px; bottom: 20px; z-index: 7000">
			<a href="#!" id="rotateImg"  class=" btn btn-floating white-text  frama-orange hover-frama-purple  waves-effect waves-green "><i class="material-icons left">rotate_left</i></a>
		</div>
		<div id="upload-demo" style="background-image: url('public/img/background-a.png');width:100%;height: calc(100%-100px);margin-top:00px"></div>

`)
		//ajout de toutes le images
		this.medias().forEach((media) => {
			htmlToInsert += this.getHtmlItem(media)
		})
		for (let i = 0; i < 4 - this.medias().length; i++) {
			htmlToInsert += `<div style="width: 100%;height: 250px"></div>`
		}
		//on attends que ca soit dait, puis on initialise le tout
		$('#mediaManagment').html(htmlToInsert)

		setTimeout(() => {
			$('#modalCroppingImage').modal();
			if (this.uploadCrop) {
				this.uploadCrop.croppie("destroy")

			}
			setTimeout(() => {

				this.uploadCrop = $('#upload-demo').croppie({
					enableExif: true,
					viewport: {
						width: 400,
						height: 300,
					},
					showZoomer: false,
					enableResize: true,
					enableOrientation: true,

				});
				$('.tooltipped').tooltip({delay: 50});
				setTimeout(() => {
					this.initAddMediaEvent()
					Materialize.updateTextFields();
				}, 50)
			}, 300)
		}, 300)
	},
	//methode a appeller avant la requete ajax
	initAddMedias() {
		$('.tooltipped').tooltip('remove');
		$("#addNewMediaToListContainer").html("")
		$("#addNewMediaToListContainer").html(this.waitingSpinner)
	},
	//callBack de la requete ajax
	addMediaCallback(mediaInfo) {
		this.recentlyAddedMedias.unshift(mediaInfo)
		this.render()
	}
}

$(document).ready(function () {
	MediaManagment.render();
})
