$(document).ready(function(){

    function checkPurchaseLoc(){
        console.log("radio value: "+$("input[name='where']:checked").val());
        let purchaseLoc = $("input[name='where']:checked").val();
        if (purchaseLoc == "onboard"){
            return 1
        }else{
            return 0
        }
    }

    let j =0;
    let fares = {};
    let zone = {};
    let selectZones = $('#select_zones');
    let total = 0;
    selectZones.empty();
    selectZones.append('<option selected="true" disabled>Choose zone</option>');
    

    let selectDays = $('#select_days');
    selectDays.empty();
    selectDays.append('<option selected="true" disabled>Choose Day/Time</option>');
    
   

    // Populate zone dropdown with list of zones
    $.getJSON("fares.json", function (data) {
    
      for(let i = 0; i<data.zones.length;i++){
        selectZones.append($('<option value='+data.zones[i].zone+'>'+data.zones[i].name+'</option>'))
            //.attr('value', data.zones[i].name).text(data.zones[i].name)
      }


      $('#select_zones').on('change', function(){
        //populate day/time dropdown for each zone
        selectDays.empty();
        selectDays.append('<option selected="true" disabled>Choose Day/Time</option>');
        $('#output').text("-");
            for(j = 0; j<=2;j+=2){
                zone =data.zones[this.value];
                fares = zone.fares[j+checkPurchaseLoc()];
                console.log(fares);
                //used 'var' so it can be accessed outside for block
                selectDays.append('<option value='+fares.price+'>'+fares.type.toUpperCase()+'</option>')
            }

            //calcuates price when day/time is selected
            $('#select_days').on('change', function(){
                checkPurchaseLoc();
                console.log(zone);
                console.log("yo: "+fares);
                let pretotal = $(this).val();
                calcTotal(pretotal);
            });


       })

    //re-calcuate price on radio button change
    $('input[name="where"]').on('change', function() {
        console.log("fares:"+fares.price);
        if(this.value == "onboard"){
            fares.price += 1.25;
        }
        //fares = zone.fares[j+checkPurchaseLoc()]
        console.log("fares2:"+fares.price);

    });

      
      //add rides
      //unexplained delay sometimes on this change event:
      $("#quantity").on('input', function(){
            console.log($(this));
            $('#output').text(parseFloat($(this).val()*total).toFixed(2));
      })

    });

    function capFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function calcTotal(pretotal){
        total = parseFloat(pretotal);
        $('#output').text(total.toFixed(2));
    }

   
})


