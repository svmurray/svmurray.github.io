"use strict";
window.onload = function ()
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    var jsonData = JSON.parse(this.responseText);
	    document.getElementById("p1").innerHTML = jsonData.name;
	    console.log(jsonData + "&&");
	  }
	};
	req.open("GET", "test.json", true);
	req.send();
}
