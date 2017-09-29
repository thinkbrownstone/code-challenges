$(document).ready(function() {
   var price=0;

  $("#trips").keyup(function() {
   Get_Data();   
  });

  $("select").change(function() {
   Get_Data(); 
  });

  $("input[name='purchase']").change(function() {
   Get_Data();  
  });


  function Get_Data(){
    $.ajax({
            url: "fares.json", 
            // local json file works in firefox not in chrome;
            //place html,css,test_script in same folder and open test_septa_.html 
            type: "GET", //GET  Read REST API 
            dataType: "json",
            error: function(data){

              $("#fare").text("ERROR! Unable to load JSON FIle");
            },
            success: function(data) {
                console.log(data);
                $.each(data.zones, function(index, value) {
                    if(value.name==$("#zone").find("option:selected").text()){
                      
                            for(var j=0;j<value.fares.length;j++){
                                if((value.fares[j].type==$("#travel").val()) && (value.fares[j].purchase==$("input[name='purchase']:checked").val())){
                                   price= value.fares[j].price;
                                   var number = $("#trips").val();  
                                   $("#fare").text("$"+(price*number).toFixed(2));
                            }

                     }    
                                
                       // }
                 }
                        

            });
                 
        },

        });

    }   
});

