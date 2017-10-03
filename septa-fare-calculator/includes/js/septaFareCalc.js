$(document).ready(function(){

//see how many rides they need
  $('#fares').on('input change', function(){

    var rides = parseInt($(this).val())

  })

  $('.fareCalcField').on('change blur', function(){

    var rides = $('#fares').val()
    var type = $('#fareCalcWhen').val()

    if(( parseInt(rides) === 10 )&&(document.getElementById('stationKiosk').checked))
    {

      type = 'anytime'

    }

    var form = {

      zone: $('#fareCalcZones').val(),
      type: type,
      where: get_checked_value(),
      rides: rides,

    }

    if(parseInt(rides) > 0 ){

      $.ajax({

        type: 'GET', 
        url: 'includes/js/septaFareCalcJSON.json',
        statusCode: {

          400 : function(){

            error('400 error')
          },

          501 : function(){

            error('501 error')

          },

          200: function(data){

            calculate_fare( data, form )

          },


        },


        failure: function(){

          error()
          
        }



      })

    }
    else
    {

      $('#fareCalcTotal').html("0.00")

    }


  })

//Are they purchasing at the kiosk or onboard?
  $('.fareCalcRadioButton').on('change', function(){

    var selected = $(this).val()

    $.ajax({

      type: 'GET', 
      url: 'includes/js/septaFareCalcJSON.json',
      statusCode: {

        400 : function(){

          error('400 error')
        },

        501 : function(){

          error('501 error')

        },

        200: function(data){

          $('#infoWhere').html(data.info[selected])

        },


      },

      failure: function(){

        error()

      }



    })

  })

 

})

function get_checked_value(){

  var radio = $('input[name=fareCalcWhere]')

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

  $('#fareCalcTotal').html( format_price( price ) )


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

      if(( parseInt( rides ) === 10 )&&(document.getElementById('stationKiosk').checked))
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

  $('.innerError').html(error)
  $('#error').animate({opacity: 1}, 2000, function(){

    setTimeout(function(){

      $('#error').animate({opacity: 0}, 2000, function(){

        $('.innerError').html('')

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