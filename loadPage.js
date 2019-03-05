"use strict";
window.onload = function ()
{
    console.log("JS Functionality");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    console.log(JSON.parse(this.responseText));
	    var jsonData = JSON.parse(this.responseText);
	    document.getElementById("header").fontSize = "50px";
	    document.getElementById("header").innerHTML = jsonData.headerData.name + "\n" + jsonData.headerData.email + "\t" + jsonData.headerData.phone;
	    console.log(jsonData + "&&");
	  }
	};
	req.open("GET", "index.json", true);
	req.send();
}
