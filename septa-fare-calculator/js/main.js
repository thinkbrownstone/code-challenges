//to store riding time explanation info
var time_info = [];

/*
  read data into widget
*/
$(document).ready(function(){
    $.getJSON("../src/file/fares.json",function(result){
      $.each(result, function(i, field){
          if(i=='zones'){           
          	    field.forEach(function ShowResults(value, index, arr){
                          var opt = document.createElement('option');
                              opt.value = value.name;
                              opt.innerHTML = value.name;
                              $("#widget-zone-option").append(opt);
                });
          }else{
                for(var i in field){
                    var obj = {};
                    obj[i] = field[i];
                    time_info.push(obj);
                }
          }
      });
    });      
});

/*
  Control the "when are you riding" section
*/
$('#widget-type-option').on('change', function(){
    
	  var str = $("#widget-type-option option:selected" ).val();

      for(var i = 0;i<time_info.length;i++){
           if(Object.keys(time_info[i])==str){
               $('#widget-type-explain').text(time_info[i][str]);
           }
      }

      if(str == "anytime"){
      	   $("input[name='widget-purchase']").eq(0).prop('checked',true);
      	   $("input[name='widget-purchase']").eq(1).prop('disabled',true);
      }else{
      	   $("input[name='widget-purchase']").eq(1).prop('disabled',false);
      }

});

/*
  Control the "how many ride" section
*/
$("#widget-trips").keyup(function(e) {
	  var code = e.keyCode || e.which;
      if(code == 13) { 
      	   var content = Number($(e.target).val());
      	   if(isNaN(content) || content % 1 !== 0 || content < 0){
      	   	   alert('Pleas input a meaningful tickets number');
      	   	   $(e.target).blur();
      	   }else if(content == 0 ){
               alert('Please buy at least one ticket');
               $(e.target).blur();
      	   }else{
               var zone = $('#widget-zone-option option:selected').text();
               var type = $('#widget-type-option option:selected').val(); 
               var purchase = $("input[name='widget-purchase']:checked").val();
      	   	   
               $.getJSON("../src/file/fares.json", function(data){
                    
                    data.zones.forEach(function(item,index,array){
                    	  if(item.name == zone){

                    	  	   item.fares.forEach(function(item){
                                    if(item.type == type && item.purchase == purchase){
                                    	var amount = content * item.price;
                                    	$('#widget-price').text("$"+amount.toFixed(2));
                                    	$(e.target).blur();
                                    }
                    	  	   })
                    	  }
                    })
               });
      	   }
      }
});