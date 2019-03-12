"use strict";
window.onload = function ()
{
    console.log("JS Functionality");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    console.log(JSON.parse(this.responseText));
	    var jsonData = JSON.parse(this.responseText);	    
	    var req2 = new XMLHttpRequest();
	    req2.onreadystatechange = function() 
	    {
	        if (this.readyState == 4 && this.status == 200) 
	        {
	            if (typeof this.responseText == "string")
	            {
	                var xmlObj = (new window.DOMParser()).parseFromString(this.responseText, "text/xml");
	                var langObj;
	                if (xmlObj.activeElement != undefined)
	                {
	                    langObj = xmlObj.activeElement.childNodes[1].childNodes;
	                }
	                else
	                {
	                    langObj = xmlObj.getElementsByTagName("langs")[0].getElementsByTagName("Item");
	                }
                    var ddm = createElement("div", "", "ddDiv");
                    ddm.appendChild(createElement("button", "Translate", "ddButton", "translatable"));
                    var ddc = createElement("div", "", "ddContainer");
                    for (var i in langObj)
                    {
                        if (langObj[i].attributes != undefined)
                        {
                            var curr = createElement("div", langObj[i].getAttribute("value"), langObj[i].getAttribute("key"));
                            ddc.appendChild(curr);
                            curr.onclick = translate;
                        }
                    }
                    ddm.appendChild(ddc);
                    holdNav.appendChild(ddm);
	            }
            }
            else if (this.readyState == 4) {console.log(this.status);};
        };
        req2.open("POST", "https://translate.yandex.net/api/v1.5/tr/getLangs?key=trnsl.1.1.20190311T164242Z.a3ee938d0c540e06.58e36ab370c756038a42d6b4148e9e68101881f7&ui=en", "true");
	    req2.send();
        
        var holdNav = createElement("div","","nav");
        holdNav.appendChild(createLink("Home",      "homeLink", jsonData.links.index, false, "translatable")); 
        holdNav.appendChild(createLink("Projects",  "projLink", jsonData.links.projects, false, "translatable")); 
        holdNav.appendChild(createLink("Resume",    "resLink",  jsonData.links.resume, false, "translatable"));

        var holdHead = document.getElementById("header");
	    holdHead.appendChild(createElement("h2", jsonData.headerData.name, "headName"));
        holdHead.appendChild(createLink(jsonData.headerData.email, "email", "mailto:" + jsonData.headerData.email, "blank"));
        holdHead.appendChild(createElement("span", jsonData.headerData.phone, "phone"));
        holdHead.appendChild(holdNav);
        
        var holdFoot = document.getElementById("footer");
        holdFoot.appendChild(createElement("span", jsonData.footerData.text, "footText", "translatable"));
        holdFoot.appendChild(createLink(jsonData.footerData.linkText, "footLink", jsonData.footerData.linkAddr, true));
        
        
        if(      document.getElementById("title").innerHTML == "Projects")  {loadProjects(jsonData);}
        else if (document.getElementById("title").innerHTML == "Home")      {loadHome(jsonData);}
        else if (document.getElementById("title").innerHTML == "Resume")    {loadResume(jsonData);}
	  } 
	};
	req.open("GET", "index.json", true);
	req.send();
}

function loadHome(json)
{
    var pDiv = createElement("div", "", "pDiv");   
    pDiv.appendChild(createImageWithProps("selfPic", json.home.picture, "Sam Murray", ["float", "marginRight", "marginBottom"], ["left", "1vw", "1em"]));
	pDiv.appendChild(createElement("h3", "About Me:", "parHead", "translatable"));
    for (var i in json.home.paragraphs) {pDiv.appendChild(createElementWithStyleProps("p", json.home.paragraphs[i].item, "pDiv" + i, ["textIndent"], ["2rem"], "translatable"));}
    document.getElementById("content").insertBefore(pDiv, document.getElementById("footer"));
    var newsDiv = createElementWithStyleProps("div", "", "newsDiv", ["marginTop"], ["2rem"]);
	newsDiv.appendChild(createElement("h3", "Recent News:", "newsHead", "translatable"));
    var newsList = newsDiv.appendChild(createElement("ul", "", "newsList"));
    for (var i in json.home.news) {newsList.appendChild(createElement("li", json.home.news[i].item, "newsItem" + i, "translatable")); }
    document.getElementById("content").insertBefore(newsDiv, document.getElementById("footer"));
}

function loadProjects(json)
{
    var projDiv = createElement("div", "", "projDiv");
	projDiv.appendChild(createElement("h3", "Projects:", "projHead", "translatable"));
	for (var i in json.projects)
	{
    	var currDiv = createElement("div", "", "projDiv" + i);
    	var currImg = createImageWithProps("projImg" + i, json.projects[i].images[1].item, json.projects[i].title,["width", "float", "marginRight", "clear", "verticalAlign"], ["3em", "left", "1vw", "left", "middle"]);
    	currImg.onclick = lb;
    	currImg.className = "lbImg";
    	currImg.dataLightbox = "testSet" + i;
    	
    	/*LightBox Shit goes here*/
    	
    	
	    currDiv.appendChild(currImg);
	    currDiv.appendChild(createElementWithStyleProps("div", json.projects[i].title, "projTit" + i, ["fontWeight"], ["bold"], "translatable"));
	    currDiv.appendChild(createElement("div", json.projects[i].desc, "projDesc" + i, "translatable"));
	    currDiv.appendChild(createElementWithStyleProps("div", "", "fill" + i, ["clear", "marginBottom"], ["both", "1em"]));
		projDiv.appendChild(currDiv);
	}
    document.getElementById("content").insertBefore(projDiv, document.getElementById("footer"));
}

function lb()
{
    window.alert("test");
}


function getJSON(addr, id)
{
	var response;
	var p = new Promise((resolve,reject) =>
	{
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if(req.readyState ==4 && req.status ==200)
			{
			    if (id == undefined)
			    {
			        console.log(JSON.parse(this.responseText));
			    }
			    else
			    {
				    response = [JSON.parse(this.responseText), id];
				    resolve(response)
			    }
			}
			else if (req.status == 4)
			{
			    var error;
			    switch (req.readyState)
			    {
			        case 401:
			            error = "401 Error: Invalid API key"
			        case 402:
			            error = "402 Error: Blocked API key"
			        case 404:
			            error = "404 Error: Exceeded the daily limit on the amount of translated text"
			        case 413:
			            error = "401 Error: Exceeded the maximum text size"
			        case 422:
			            error = "422 Error: The text cannot be translated"
			        case 501:
			            error = "501 error: The specified translation direction is not supported"
	            }
	            if (error == undefined) {error = "Unexpected Error";}
			    window.alert(error);
		    }
		}
		req.open("GET", addr, true);
		req.send();
	});
	return p;
}

function translate()
{
    var els = document.getElementsByClassName("translatable");
    for (var i in els)
    {
        if(els[i].id != undefined)
        {
            var addr = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190311T164242Z.a3ee938d0c540e06.58e36ab370c756038a42d6b4148e9e68101881f7&text=" + encodeURI(els[i].innerHTML) + "&lang=en-" + this.id; 
            getJSON(addr, els[i].id).then(results => {document.getElementById(results[1]).innerHTML = results[0].text[0];});
        }
    }
    console.log("endTrans");
}

function createImageWithProps(id, src, alt, props, vals)
{
    var result = createElement("img", "", id);
    result.src = src;
    result.alt = alt;
    for (var i in props) {result.style[props[i]] = vals[i];}
    return result;
}

function createElementWithStyleProps(type, content, id, props, values, className)
{
    var result = createElement(type, content, id, className);
    for (var i in props) {result.style[props[i]] = values[i];}
    return result;
}

function createLink(content, id, addr, blankTF, className)
{
    var result = createElement("a", content, id, className);
    result.href = addr;
    if (blankTF) {result.target = "blank";}
    return result;
}

function createElement(type, content, id, className)
{
	var element1 = document.createElement(type);
	element1.innerHTML = content;
	element1.id = id;
	element1.className = className;
	return element1;
}

function loadResume(json)
{
    var eduDiv = createElement("div", "", "eduDiv"); 
    eduDiv.appendChild(createElement("h3", "Education", "eduHead", "translatable"));
    var eduList = eduDiv.appendChild(createElement("ul", "", "eduList"));
    for (var i in json.resume.education)
    {
        if (typeof json.resume.education[i] == "object")
        {
            eduList.appendChild(createElement("li", json.resume.education[i].value, "edu" + i, "translatable"));
            var innerList = createElement("ul", "", "SAList");
            innerList.appendChild(createElement("li", json.resume.education[i].jterm, "jterm", "translatable"));
            innerList.appendChild(createElement("li", json.resume.education[i].semester, "semester", "translatable"));
            eduList.appendChild(innerList)
        }
        else 
        {
            if ((json.resume.education[i]).indexOf("University") >= 0)
            {
                var ele = createElement("li", "", "edu" + i);
                ele.appendChild(createLink(json.resume.education[i], "ustLink", "http://stthomas.edu", true, "translatable"));
                eduList.appendChild(ele);
            }
            else if (json.resume.education[i].indexOf("Aquinas") >= 0)
            {
                var ele = createElement("li", "", "edu" + i);
                ele.appendChild(createLink(json.resume.education[i], "aqLink", "https://www.stthomas.edu/aquinasscholars/", true, "translatable"));
                eduList.appendChild(ele);
            }
            else {eduList.appendChild(createElement("li", json.resume.education[i], "edu" + i, "translatable"));}
        }
    }
    document.getElementById("content").insertBefore(eduDiv, document.getElementById("footer"));
    var workDiv = createElementWithStyleProps("div", "", "workDiv", ["marginTop"], ["2em"]);
    workDiv.appendChild(createElement("h3", "Work", "workHead", "translatable"));
    var workList = workDiv.appendChild(createElementWithStyleProps("ul", "", "workList", ["listStyle", "paddingLeft"], ["none", "1vw"]));
    for (i in json.resume.work)
    {
        var currEl = createElement("li", "", "work" + i);
        var ele = createElementWithStyleProps("li", "", "link" + i, ["paddingTop", "display", "cssFloat"], [".5rem", "block", "left"]);
        ele.appendChild(createLink(json.resume.work[i].comp, json.resume.work[i].comp + "Link", json.resume.work[i].link, true, "translatable"));
        currEl.appendChild(ele);
        currEl.appendChild(createElementWithStyleProps("span", json.resume.work[i].loca, "workLoca" + i, ["display", "textAlign", "cssFloat", "paddingTop"], ["block", "right", "right", ".5rem"], "translatable"));
        if (typeof json.resume.work[i].date == "object")
        {
            for (j in json.resume.work[i].date)
            {
                currEl.appendChild(createElementWithStyleProps("div",json.resume.work[i].date[j].time,"workDate"+i+"_"+j,["clear","display","textAlign","cssFloat"],["both","block","right","right"], "translatable"));
                currEl.appendChild(createElementWithStyleProps("div",json.resume.work[i].title[j].data,"workTit"+i+"_"+j,["display","clear","paddingLeft","fontStyle"],["block","left","2vw","italic"], "translatable"));
                currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].resp[j].info, "workResp" + i + "_" + j, ["paddingLeft"], ["4vw"], "translatable"));
            }
        }
        else if (typeof json.resume.work[i].title == "object")
        {
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].date, "workDate" + i, ["clear", "display", "textAlign", "cssFloat"], ["both", "block", "right", "right"], "translatable"));
            for (j in json.resume.work[i].title)
            {
                currEl.appendChild(createElementWithStyleProps("div",json.resume.work[i].title[j].data,"workTit"+i+"_"+j,["display","clear","paddingLeft","fontStyle"],["block","left","2vw","italic"], "translatable"));
                currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].resp[j].info, "workResp" + i + "_" + j, ["paddingLeft"], ["4vw"], "translatable"));
            }
        }
        else
        {
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].date, "workDate" + i, ["clear", "display", "textAlign", "cssFloat"], ["both", "block", "right", "right"], "translatable"));
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].title, "workTit" + i, ["display", "clear", "paddingLeft", "fontStyle"], ["block", "left", "2vw", "italic"], "translatable"));
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].resp, "workResp" + i, ["paddingLeft"], ["4vw"], "translatable"));
        }
        workList.appendChild(currEl);             
    }
    document.getElementById("content").insertBefore(workDiv, document.getElementById("footer"));

    var leadDiv = createElementWithStyleProps("div", "", "leadDiv", ["marginTop"], ["2em"]);
    leadDiv.appendChild(createElement("h3", "Leadership, Activities, & Honors", "leadHead", "translatable"));
    var leadList = leadDiv.appendChild(createElement("ul", "", "leadList"));
    for (i in json.resume.leadership)
    {
	    if (typeof json.resume.leadership[i].data == "object")
	    {
	        var currEl = createElement("li", json.resume.leadership[i].value, "lead" + i, "translatable");
	        var currList = currEl.appendChild(createElement("ul", "", json.resume.leadership[i].data + "list", "translatable"));
	        for (var j in json.resume.leadership[i].data) {currList.appendChild(createElement("li", json.resume.leadership[i].data[j].info, "lead" + i + "_" + j, "translatable"));}
	        leadList.appendChild(currEl);
	    }
	    else {leadList.appendChild(createElement("li", json.resume.leadership[i].value, "lead" + i, "translatable"));}
    }
    document.getElementById("content").insertBefore(leadDiv, document.getElementById("footer"));
    var skillDiv = createElementWithStyleProps("div", "", "skillDiv", ["marginTop"], ["2em"]);
    skillDiv.appendChild(createElement("h3", "Skills", "skillHead", "translatable"));
    var skillList = skillDiv.appendChild(createElement("ul", "", "skillList"));
    for (i in json.resume.skills) {skillList.appendChild(createElement("li", json.resume.skills[i].value, "skill" + i, "translatable"));}
    document.getElementById("content").insertBefore(skillDiv, document.getElementById("footer")); 
}
