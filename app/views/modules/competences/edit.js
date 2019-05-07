
//a lancer au démarrage
$(document).ready(function () {
	let displayValue = function(hoveredSectionId,hoveredIndex, value){
		for(let i = 0;i<5; i++){
			if(i<=value){
				$('#competenceValue-'+hoveredSectionId+'-'+hoveredIndex+'-'+i).html("lens")
			}else{
				$('#competenceValue-'+hoveredSectionId+'-'+hoveredIndex+'-'+i).html("panorama_fish_eye")
			}
		}

	}
	$('.competenceValue' ).click(
		function () {
			let Index = this.id.split("-")[2]
			let SectionId = this.id.split("-")[1]
			let value=this.id.split("-")[3]
			console.log(value)
			console.log(Index)

			$('#uglyForm input[name=uglyForm-'+SectionId+'-value'+Index+']').val(value )
			initMainSaveBtn()
			displayValue(SectionId,Index, value)
		}
	)
})