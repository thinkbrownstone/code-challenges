$(document).ready(function(){

	$('#splash').animate({opacity: 0}, 5000, function(){

		$(this).css('z-index', -1)

	})

	$('#septa-image').on('click', function(){

		$('.septa-container').animate({'opacity': 0}, 1500)

		$('#septa-map').animate({opacity: 1}, 1500).css({'z-index': 3000, 'cursor': 'pointer'})

	})

	$('.close').on('click', function(){

		$('#main-message').html('Goodbye')

		$('#splash').css('z-index', 3000).animate({opacity: 1}, 2000, function(){

			window.location.href = "https://www.thinkbrownstone.com"

		} )

	})


	$('#septa-map').on('click', function(){

		$('.septa-container').animate({'opacity': 1}, 1500)

		$(this).animate({opacity: 0}, 1500, function(){

			$(this).css('z-index', -1)

		}).removeAttr('style')

	})


	$('#fares').on('input change', function(){

		var rides = parseInt($(this).val())

		if( rides > 10 )
		{

			$(this).val('')
			error('You may only purchase up to ten rides at a time.')

		}

		var fare = $(this).val().toString().split('')

		var allowed = '0123456789'

		for(var i = 0; i < fare.length; i++ ){

			if( allowed.indexOf(fare[i]) > -1 ){

				continue

			}
			else
			{

				$( this ).val('')
				error('This field only accepts numbers.')
				break

			}

		}

	})

	$('.septa-field').on('change blur', function(){

		var rides = $('#fares').val()
		var type = $('#septa-when').val()

		if( parseInt(rides) === 10 )
		{

			type = 'anytime'

		}

		var form = {

			zone: $('#septa-going').val(),
			type: type,
			where: get_checked_value(),
			rides: rides,

		}

		if(parseInt(rides) > 0 ){

			$.ajax({

				type: 'GET', 
				url: './fares.json',
				statusCode: {

					400 : function(){

						error('That did not work.')
					},

					501 : function(){

						error('That did not work.')

					},

					200: function(data){

						calculate_fare( data, form )

					},


				},

				// success: function(data){

				// 	calculate_fare( data, form )

				// },

				failure: function(){

					error()
					
				}



			})

		}
		else
		{

			$('#septa-total').html("0.00")

		}


	})


	$('.septa-radio-button').on('change', function(){

		var selected = $(this).val()

		$.ajax({

			type: 'GET', 
			url: './fares.json',
			statusCode: {

				400 : function(){

					error('That did not work.')
				},

				501 : function(){

					error('That did not work.')

				},

				200: function(data){

					$('#info-where').html(data.info[selected])

				},


			},
			// success: function(data){

			// 	$('#info-where').html(data.info[selected])

			// },
			failure: function(){

				error()

			}



		})

	})

	$('.septa-time').on('change', function(){

		var selected = $(this).val()

		$.ajax({

			type: 'GET', 
			url: './fares.json',
			// success: function(data){

			// 	$('#info-when').html(data.info[selected])

			// },
			statusCode: {

				400 : function(){

					error('That did not work.')
				},

				501 : function(){

					error('That did not work.')

				},

				200: function(data){

					$('#info-when').html(data.info[selected])

				},


			},
			failure: function(){

				error()

			}



		})

	})

})

function get_checked_value(){

	var radio = $('input[name=septa-where]')

	for(var i = 0; i < radio.length; i++ )
	{

		if(radio[i].checked){

			return $(radio[i]).val()

		}

	}


}

function calculate_fare( data, form )
{

	var zones = data['zones']
	var current_zone = get_current_zone( zones, form['zone'] )
	var fares = current_zone['fares']
	var price = get_current_price(fares, form['where'], form['type'], form['rides'])

	$('#septa-total').html( format_price( price ) )


}

function format_price( price ){

	var s_price = price.toString().split('.')

	if( s_price.length === 1 )
	{

		return s_price[0] + '.' + '00'

	}
	else if( s_price[1].split('').length === 1 )
	{

		return s_price[0] + '.' + s_price[1] + '0'

	}
	else
	{

		return price

	}

}

function get_current_price( fares, where, type, rides ){


	for( var i = 0; i < fares.length; i++ )
	{

		if(fares[i]['purchase'] === where && fares[i]['type'] === type )
		{

			if( parseInt( rides ) === 10 )
			{

				return fares[i]['price'] 

			}
			else
			{

				return fares[i]['price'] * rides

			}

			

		}

	}

}

function error( error ) {

	window.scrollTo(0, 0)

	$('.inner-error').html(error)
	$('#error').animate({opacity: 1}, 2000, function(){

		setTimeout(function(){

			$('#error').animate({opacity: 0}, 2000, function(){

				$('.inner-error').html('')

			})
			

		}, 2000)

	})

}


function get_current_zone(zones, zone){

	for( var i = 0; i < zones.length; i++ ){

		

		if( parseInt( zones[i]['zone'] ) === parseInt( zone ) )
		{

			return zones[i]

		}

	}

}