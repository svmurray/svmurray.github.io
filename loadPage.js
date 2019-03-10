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
        holdNav.appendChild(createLink("Home",      "homeLink", jsonData.links.index, false)); 
        holdNav.appendChild(createLink("Projects",  "projLink", jsonData.links.projects, false)); 
        holdNav.appendChild(createLink("Resume",    "resLink",  jsonData.links.resume, false)); 

        var holdHead = document.getElementById("header");
	    holdHead.appendChild(createElement("h2", jsonData.headerData.name, "headName"));
        holdHead.appendChild(createLink(jsonData.headerData.email, "email", "mailto:" + jsonData.headerData.email, "blank"));
        holdHead.appendChild(createElement("span", jsonData.headerData.phone, "phone"));
        holdHead.appendChild(holdNav);
        
        var holdFoot = document.getElementById("footer");
        holdFoot.appendChild(createElement("span", jsonData.footerData.text, "footText"));
        holdFoot.appendChild(createLink(jsonData.footerData.linkText, "footLink", jsonData.footerData.linkAddr, true));
        
        var ddm = createElement("div", "", "ddDiv");
        ddm.appendChild(createElement("button", "Menu", "ddButton"));
        var ddc = createElement("div", "", "ddContainer");
        ddc.appendChild(createElement("a", "test", "option1"));
        ddm.appendChild(ddc);
        holdFoot.appendChild(ddm); //dropdown menu
        
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
    pDiv.appendChild(createImageWithProps("selfPic", "me.jpg", "Sam Murray", ["height", "float", "marginRight", "marginBottom"], ["15em", "left", "1vw", "1em"]));
	pDiv.appendChild(createElement("h3", "About Me:", "parHead"));
    for (var i in json.home.paragraphs) {pDiv.appendChild(createElementWithStyleProps("p", json.home.paragraphs[i].item, "pDiv" + i, ["textIndent"], ["2rem"]));}
    document.getElementById("content").insertBefore(pDiv, document.getElementById("footer"));
    var newsDiv = createElementWithStyleProps("div", "", "newsDiv", ["marginTop"], ["2rem"]);
	newsDiv.appendChild(createElement("h3", "Recent News:", "newsHead"));
    var newsList = newsDiv.appendChild(createElement("ul", "", "newsList"));
    for (var i in json.home.news) {newsList.appendChild(createElement("li", json.home.news[i].item, "newsItem" + i)); }
    document.getElementById("content").insertBefore(newsDiv, document.getElementById("footer"));
}

function loadProjects(json)
{
    var projDiv = createElement("div", "", "projDiv");
	projDiv.appendChild(createElement("h3", "Projects:", "projHead"));
	for (var i in json.projects)
	{
    	var currDiv = createElement("div", "", "projDiv" + i);
    	var currImg = createImageWithProps("projImg" + i, json.projects[i].images[1].item, json.projects[i].title,["width", "float", "marginRight", "clear", "verticalAlign"], ["3em", "left", "1vw", "left", "middle"]);
    	currImg.onclick = lb;
    	currImg.className = "lbImg";
    	currImg.dataLightbox = "testSet" + i;
    	
    	/*LightBox Shit goes here*/
    	
    	
	    currDiv.appendChild(currImg);
	    currDiv.appendChild(createElementWithStyleProps("div", json.projects[i].title, "projTit" + i, ["fontWeight"], ["bold"]));
	    currDiv.appendChild(createElement("div", json.projects[i].desc, "projDesc" + i));
	    currDiv.appendChild(createElementWithStyleProps("div", "", "fill" + i, ["clear", "marginBottom"], ["both", "1em"]));
		projDiv.appendChild(currDiv);
	}
    document.getElementById("content").insertBefore(projDiv, document.getElementById("footer"));
}

function lb()
{
    window.alert("test");
}

function createImageWithProps(id, src, alt, props, vals)
{
    var result = createElement("img", "", id);
    result.src = src;
    result.alt = alt;
    for (var i in props) {result.style[props[i]] = vals[i];}
    return result;
}

function createElementWithStyleProps(type, content, id, props, values)
{
    var result = createElement(type, content, id);
    for (var i in props) {result.style[props[i]] = values[i];}
    return result;
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

function loadResume(json)
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
        }
        else 
        {
            if ((json.resume.education[i]).indexOf("University") >= 0)
            {
                var ele = createElement("li", "", "edu" + i);
                ele.appendChild(createLink(json.resume.education[i], "ustLink", "http://stthomas.edu", true));
                eduList.appendChild(ele);
            }
            else if (json.resume.education[i].indexOf("Aquinas") >= 0)
            {
                var ele = createElement("li", "", "edu" + i);
                ele.appendChild(createLink(json.resume.education[i], "aqLink", "https://www.stthomas.edu/aquinasscholars/", true));
                eduList.appendChild(ele);
            }
            else {eduList.appendChild(createElement("li", json.resume.education[i], "edu" + i));}
        }
    }
    document.getElementById("content").insertBefore(eduDiv, document.getElementById("footer"));
    var workDiv = createElementWithStyleProps("div", "", "workDiv", ["marginTop"], ["2em"]);
    workDiv.appendChild(createElement("h3", "Work", "workHead"));
    var linkAr = ["https://www.ge.com/renewableenergy", "http://stthomas.edu", "https://www.dedicatedcomputing.com/", "http://www.lindner-marsack.com/", "http://www.villageofpewaukeewi.us/"]
    
    var workList = workDiv.appendChild(createElementWithStyleProps("ul", "", "workList", ["listStyle", "paddingLeft"], ["none", "1vw"]));
    for (i in json.resume.work)
    {
        var currEl = createElement("li", "", "work" + i);
        
        var ele = createElementWithStyleProps("li", "", "link" + i, ["paddingTop", "display", "cssFloat"], [".5rem", "block", "left"]);
        ele.appendChild(createLink(json.resume.work[i].comp, json.resume.work[i].comp + "Link", "https://www.stthomas.edu/aquinasscholars/", true));
        currEl.appendChild(ele);
        currEl.appendChild(createElementWithStyleProps("span", json.resume.work[i].loca, "workLoca" + i, ["display", "textAlign", "cssFloat", "paddingTop"], ["block", "right", "right", ".5rem"]));
        if (typeof json.resume.work[i].date == "object")
        {
            for (j in json.resume.work[i].date)
            {
                currEl.appendChild(createElementWithStyleProps("div",json.resume.work[i].date[j].time,"workDate"+i+"_"+j,["clear","display","textAlign","cssFloat"],["both","block","right","right"]));
                currEl.appendChild(createElementWithStyleProps("div",json.resume.work[i].title[j].data,"workTit"+i+"_"+j,["display","clear","paddingLeft","fontStyle"],["block","left","2vw","italic"]));
                currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].resp[j].info, "workResp" + i + "_" + j, ["paddingLeft"], ["4vw"]));
            }
        }
        else if (typeof json.resume.work[i].title == "object")
        {
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].date, "workDate" + i, ["clear", "display", "textAlign", "cssFloat"], ["both", "block", "right", "right"]));
            for (j in json.resume.work[i].title)
            {
                currEl.appendChild(createElementWithStyleProps("div",json.resume.work[i].title[j].data,"workTit"+i+"_"+j,["display","clear","paddingLeft","fontStyle"],["block","left","2vw","italic"]));
                currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].resp[j].info, "workResp" + i + "_" + j, ["paddingLeft"], ["4vw"]));
            }
        }
        else
        {
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].date, "workDate" + i, ["clear", "display", "textAlign", "cssFloat"], ["both", "block", "right", "right"]));
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].title, "workTit" + i, ["display", "clear", "paddingLeft", "fontStyle"], ["block", "left", "2vw", "italic"]));
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].resp, "workResp" + i, ["paddingLeft"], ["4vw"]));
        }
        workList.appendChild(currEl);             
    }
    document.getElementById("content").insertBefore(workDiv, document.getElementById("footer"));

    var leadDiv = createElementWithStyleProps("div", "", "leadDiv", ["marginTop"], ["2em"]);
    leadDiv.appendChild(createElement("h3", "Leadership, Activities, & Honors", "leadHead"));
    var leadList = leadDiv.appendChild(createElement("ul", "", "leadList"));
    for (i in json.resume.leadership)
    {
	    if (typeof json.resume.leadership[i].data == "object")
	    {
	        var currEl = createElement("li", json.resume.leadership[i].value, "lead" + i);
	        var currList = currEl.appendChild(createElement("ul", "", json.resume.leadership[i].data + "list"));
	        for (var j in json.resume.leadership[i].data) {currList.appendChild(createElement("li", json.resume.leadership[i].data[j].info, "lead" + i + "_" + j));}
	        leadList.appendChild(currEl);
	    }
	    else {leadList.appendChild(createElement("li", json.resume.leadership[i].value, "lead" + i));}
    }
    document.getElementById("content").insertBefore(leadDiv, document.getElementById("footer"));
    var skillDiv = createElementWithStyleProps("div", "", "skillDiv", ["marginTop"], ["2em"]);
    skillDiv.appendChild(createElement("h3", "Skills", "skillHead"));
    var skillList = skillDiv.appendChild(createElement("ul", "", "skillList"));
    for (i in json.resume.skills) {skillList.appendChild(createElement("li", json.resume.skills[i].value, "skill" + i));}
    document.getElementById("content").insertBefore(skillDiv, document.getElementById("footer")); 
}
