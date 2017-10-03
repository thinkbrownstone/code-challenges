$(document).ready(function(){
	$.getJSON("fares.json", function(json){
	var t = [];
	$.each(json.zones, function(i,item){
		t.push('<option value="'+item.zone+'">'+item.name+'</option>');
	});
	$("<select/>", {
	  html: t.join("")
		}).appendTo(".zone-select")
	});
});