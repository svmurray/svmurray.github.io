"use strict";
window.onload = function ()
{
    console.log("JS Functionality");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    var jsonData = JSON.parse(this.responseText);
	    document.getElementById("header").innerHTML = jsonData.name;
	    console.log(jsonData + "&&");
	  }
	};
	req.open("GET", "index.json", true);
	req.send();
}
