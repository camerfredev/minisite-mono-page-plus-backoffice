caroutextSlider = []
$(document).ready(function () {

		$(window).bind("load", function () {
			switchToCaroutextImg = function (id, img) {
				$('#caroutextImgFocus-' + id + ' img').fadeOut( function () {
					$('#caroutextImgFocus-' + id + ' img').attr('src', $(img).attr('src'))
					$(this).fadeIn('slow')
				})
			}
			makeCaroutextBeautifull =function(id) {
				let imgArray = []
				let ratioSum = 0
				$('#' + id + ' .caroutextImage ').each(function (i, el) {
					let natratio = parseInt(($(this).get(0).naturalHeight / $(this).get(0).naturalWidth) * 1000)
					imgArray[i] = natratio
					ratioSum += natratio
				})
				setTimeout(function () {
					$('#' + id + ' .caroutextImage').each(function (j) {
						let flexAttr = parseInt((parseInt(ratioSum) / parseInt(imgArray[j])) * 10000)
						$(this).parent().attr('style', 'flex : ' + flexAttr)
					})
				}, 100)
				setTimeout(function () {
					$('#' + id + ' .flexImagesContainer').removeClass('hidden')
				}, 100)

				$('#' + id + ' .caroutextImage').click(function () {
					switchToCaroutextImg(id, this)
					caroutextSlider[id] = -10
				})

				caroutextSlider[id] = 0
			}

			autoSlideCaroutext = function (id) {
				if(caroutextSlider>= 0){
					if(caroutextSlider[id] > 3){
						caroutextSlider[id] =-1
					}
					setTimeout(function () {
						console.log(id)
						switchToCaroutextImg(id, '#' + id + ' #moduleValue-imgUrl'+caroutextSlider[id])

						caroutextSlider[id] ++
						autoSlideCaroutext(id)
					},3000)

				}



			}

			setTimeout(function () {
			$('.flexImagesContainer').each(function (i, el) {
				let id = this.id.split('-')[1]
				makeCaroutextBeautifull(id)
				//autoSlideCaroutext(id)
			})
			}, 200)

		})
	// $('.showOnScrollCaroutext').each(function (i, el) {
	// 	scrollFireOptions.push(
	// 		{selector: '#'+el.id, offset: 200, callback: function(el1) {
	// 				$(el1).animate({'left' :'-=1500'}, 350, 'swing')
	// 			} })
	// })

})
