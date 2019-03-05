"use strict";
window.onload = function ()
{
    console.log("JS Functionality");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    console.log(JSON.parse(this.responseText));
	    var jsonData = JSON.parse(this.responseText);
        var holdHead = document.getElementById("header");
	    holdHead.appendChild(createElement("h2", jsonData.headerData.name, "headName"));

        var holdEl = createElement("a", jsonData.headerData.email, "email");
        holdEl.href = "mailto:" + jsonData.headerData.email;
        holdEl.target = "blank";

        holdHead.appendChild(holdEl);
        holdHead.appendChild(createElement("span", jsonData.headerData.phone, "phone"));
        
        var holdNav = createElement("div","","nav");
        holdEl = createElement("a", "Home", "homeLink");
        holdEl.href = jsonData.links.index;
        holdNav.appendChild(holdEl);
        holdEl = createElement("a", "Projects", "projLink");
        holdEl.href = jsonData.links.projects;
        holdNav.appendChild(holdEl);
        holdEl = createElement("a", "Resume", "resLink");
        holdEl.href = jsonData.links.resume;
        holdNav.appendChild(holdEl);
        holdHead.appendChild(holdNav);


        
        var holdFoot = document.getElementById("footer");
        holdFoot.appendChild(createElement("span", jsonData.footerData.text, "footText"));
        
        holdEl = createElement("a", jsonData.footerData.linkText, "footLink");
        holdEl.href = jsonData.footerData.linkAddr;
        holdEl.target = "blank";
        holdFoot.appendChild(holdEl);
        
	    
	    
	    //document.getElementById("header").innerHTML = jsonData.headerData.name + "\n" + jsonData.headerData.email + "\t" + jsonData.headerData.phone;
	    //console.log(jsonData + "&&");
	  }
	};
	req.open("GET", "index.json", true);
	req.send();
}

function createElement(type, content, id)
{
	var element1 = document.createElement(type);
	element1.innerHTML = content;
	element1.id = id;
	
	return element1;
}
