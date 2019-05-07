EditIcon = {
	//id du bouton changer l'icone cliqué
	id: "",
	//liste des icones possibles
	iconList: [
		"ac_unit", "access_time", "accessibility", "account_circle",
		"local_grocery_store", "airport_shuttle", "airplanemode_active", "all_inclusive",
		"apps", "assessment", "attach_file", "attach_money", "autorenew", "audiotrack", "assistant_photo", "backup",
		"bookmark", "border_color", "build", "cake", "business_center", "camera",
		"camera_alt", "chat", "check_box", "child_friendly", "color_lens", "directions_bike",
		"directions_transit", "directions_car", "euro_symbol", "event_seat", "extension", "favorite",
		"face", "filter_hdr", "filter_vintage", "fitness_center", "flash_on", "fingerprint",
		"free_breakfast", "gps_fixed", "grade", "group", "headset", "home",
		"import_contacts", "invert_colors", "lightbulb_outline", "local_dining", "local_florist",
		"local_shipping", "nature_people",
		"markunread", "new_releases", "person_add", "pets", "radio", "room", "settings", "spa",
		"tag_faces", "toys", "traffic", "verified_user", "weekend"
	],
	//methode de rendu de la liste d'icones
	render(id) {
		this.id = id
		let htmlToInclude = ""
		this.iconList.forEach((icon) => {
			htmlToInclude += `
			<div class="col s6 m3 l2" style="margin-bottom: 30px">
				<i class="white light-shadow material-icons medium frama-purple-text hoverBorderInBox singleIcon"style="padding: 10px;  !important; cursor: pointer">${icon}</i>
			</div>
		`
			$('#iconList').html(htmlToInclude)
			setTimeout(() => {
				this.initEvents()
			}, 300)
		})

	},
	initEvents() {
		let that = this
		$('.singleIcon').click(function () {
			let icon = $(this).html()
			let sectionId = that.id.split('-')[1]
			let iconToChange = that.id.split('-')[2]
			$('#uglyForm input[name=uglyForm-' + sectionId + '-' + iconToChange + ']').val(icon)
			$('#' + sectionId + ' #moduleValue-' + iconToChange).html(icon)
			$('#chooseIconModal').modal('close')
			initMainSaveBtn()
		})
	}
}
//a lancer au démarrage
$(document).ready(function () {
	$('#chooseIconModal').modal()
	//lorsqu'un bouton d"edition d'icone est lancé :
	$('.editIconBtn').click(function () {
		//on récuper l'id et on demande le rendu de la liste d'icones
		let id = this.id
		EditIcon.render(id)
		$('#chooseIconModal').modal('open')
	})
})