// script.json

$(document).ready(function() {
   var price=0;

  $("#numRides").keyup(function() {
   ajaxCall();   
  });

  $("select").change(function() {
   ajaxCall(); 
  });

  $("input[name='place']").change(function() {
   ajaxCall();  
  });


  function ajaxCall(){
    $.ajax({
            url: "fares.json",
            type: "POST",
            dataType: "json",
            success: function(data) {

                $.each(data.zones, function(index, value) {
                    if(value.name==$("#zones").find("option:selected").text()){
                      
                            for(var i=0;i<value.fares.length;i++){
                                if((value.fares[i].type==$("#travelTime").val()) && (value.fares[i].purchase==$("input[name='place']:checked").val())){
                                   price= value.fares[i].price;
                                   var number = $("#numRides").val();  
                                   $("#fare").text("$"+ (price*number).toFixed(2));
                            }

                     }    
                                
                       // }
                 }
                        

            });
                 
        },

        });

    }   
});