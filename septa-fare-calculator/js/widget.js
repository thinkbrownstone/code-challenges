var zones;
var fares;
var response;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		response = JSON.parse(xhttp.responseText);
		zones = response.zones;
		fares = response.zones[0].fares;
       //console.log(response.zones[0].name);
       var output = '';
       var output2 = '';
       var faresArray = [];
       
       for (var i = 0; i < zones.length; i++){
       	output += '<option value = "'+(zones[i].zone -1) +'">' + zones[i].name + '</option>';
       }       

       for (var i = 0; i<fares.length; i++){
       	if (!faresArray.includes(fares[i].type)){
       		faresArray.push(fares[i].type);
       	}
       }

       for (var i = 0; i < faresArray.length; i++){
       	output2 += '<option value = "'+faresArray[i]+'">' + faresArray[i] + '</option>';
       }

       console.log(faresArray);

       document.getElementById('zones').innerHTML = output;
       document.getElementById('fareType').innerHTML = output2;
   }
};
xhttp.open("GET", "fares.json", true);
xhttp.send();

function calculatesFare(){
	var zone = document.getElementById('zones').value;
	var type = document.getElementById('fareType').value;
	var purchase;
	if (document.getElementById('station').checked){
		purchase = "advance_purchase";
	}
	else{
		purchase = "onboard_purchase";
	}
	var number = document.getElementById('ticketAmount').value;
	var calculation = response.zones[zone].fares.filter(x => x.type = type).find(x => x.purchase = purchase).price;
	document.getElementById('total').innerHTML = (number * calculation);
}