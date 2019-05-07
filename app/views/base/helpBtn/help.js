
$(document).ready(function() {
	$('#helpModal').modal({
		startingTop: '5%', // Starting top style attribute
		endingTop: '5%', // Ending top style attribute
	});
	$('#help-content-btn').click(function () {
		$('#help-content-tab').click()
	});
	$('#help-structure-btn').click(function () {
		$('#help-structure-tab').click()
	});
	$('#help-perso-btn').click(function () {
		$('#help-perso-tab').click()
	});
});