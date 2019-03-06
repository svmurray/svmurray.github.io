"use strict";
window.onload = function ()
{
    console.log("JS Functionality");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    console.log(JSON.parse(this.responseText));
	    var jsonData = JSON.parse(this.responseText);
        
        var holdNav = createElement("div","","nav");
        holdNav.appendChild(createLink("Home", "homeLink", jsonData.links.index, false)); 
        holdNav.appendChild(createLink("Projects", "projLink", jsonData.links.projects, false)); 
        holdNav.appendChild(createLink("Resume", "resLink", jsonData.links.resume, false)); 

        var holdHead = document.getElementById("header");
	    holdHead.appendChild(createElement("h2", jsonData.headerData.name, "headName"));
        holdHead.appendChild(createLink(jsonData.headerData.email, "email", "mailto:" + jsonData.headerData.email, "blank"));
        holdHead.appendChild(createElement("span", jsonData.headerData.phone, "phone"));
        holdHead.appendChild(holdNav);
        
        var holdFoot = document.getElementById("footer");
        holdFoot.appendChild(createElement("span", jsonData.footerData.text, "footText"));
        holdFoot.appendChild(createLink(jsonData.footerData.linkText, "footLink", jsonData.footerData.linkAddr, true));
        
        loadContent(document.getElementById("title").innerHTML, jsonData);
	  }
	};
	req.open("GET", "index.json", true);
	req.send();
}

function loadContent(page, json)
{
    if(page == "Projects")
    {
        console.log("projects conditional")
    }
    else if (page == "Home")
    {
        console.log("home conditional")
    }
    else if (page == "Resume")
    {
        var eduDiv = createElement("div", "", "eduDiv"); 
        eduDiv.appendChild(createElement("h3", "Education", "eduHead"));
        var eduList = eduDiv.appendChild(createElement("ul", "", "eduList"));
        for (var i in json.resume.education)
        {
            if (typeof json.resume.education[i] == "object")
            {
                eduList.appendChild(createElement("li", json.resume.education[i].value, "edu" + i));
                var innerList = createElement("ul", "", "SAList");
                innerList.appendChild(createElement("li", json.resume.education[i].jterm, "jterm"));
                innerList.appendChild(createElement("li", json.resume.education[i].semester, "semester"));
                eduList.appendChild(innerList)
                console.log("Got an obj her cap'n");
            }
            else {eduList.appendChild(createElement("li", json.resume.education[i], "edu" + i));}
        }
        document.getElementById("content").insertBefore(eduDiv, document.getElementById("footer"));
        
        var workDiv = createElement("div", "", "workDiv");
        workDiv.appendChild(createElement("h3", "Work", "workHead"));
        var workList = workDiv.appendChild(createElement("ul", "", "workList"));
        for (i in json.resume.work)
        {
            workList.appendChild(createElement("li", json.resume.work[i].comp + "**" + json.resume.work[i].loca + "**" + json.resume.work[i].date + "**" + json.resume.work[i].title + "**" + json.resume.work[i].resp, "work" + i));
        }
        document.getElementById("content").insertBefore(workDiv, document.getElementById("footer"));
    }
}

function createLink(content, id, addr, blankTF)
{
    var result = createElement("a", content, id);
    result.href = addr;
    if (blankTF) {result.target = "blank";}
    return result;
}

function createElement(type, content, id)
{
	var element1 = document.createElement(type);
	element1.innerHTML = content;
	element1.id = id;
	
	return element1;
}
