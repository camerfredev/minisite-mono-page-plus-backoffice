$(document).ready(function () {
	$('.editMap').click(function () {
		let sectionId = this.id.split('-')[1]
		$('#editMapLabel-'+sectionId).removeClass('displaynone')
		function onMapClick(e) {
			mymaps[sectionId].removeLayer(mymarkers[sectionId])
			mymarkers[sectionId] = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymaps[sectionId] );
			$('#uglyForm input[name=uglyForm-' + sectionId + '-lat]').val(e.latlng.lat)
			$('#uglyForm input[name=uglyForm-' + sectionId + '-lon]').val(e.latlng.lng)
			Materialize.toast('Position mise à jour, pensez à sauvegarder', 3000, 'orange')
			initMainSaveBtn()

		}

		mymaps[sectionId].on('click', onMapClick);
	})
})