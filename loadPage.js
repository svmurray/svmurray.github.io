"use strict";
window.onload = function () {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    var jsonData = JSON.parse(this.responseText);	    
	    var req2 = new XMLHttpRequest();
	    req2.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
                var xmlObj = (new window.DOMParser()).parseFromString(this.responseText, "text/xml");
                var langObj;
                if (xmlObj.activeElement != undefined && xmlObj.activeElement != null) {langObj = xmlObj.activeElement.childNodes[1].childNodes;} //Firefox
                else {langObj = xmlObj.getElementsByTagName("langs")[0].getElementsByTagName("Item");}//Chrome
                var ddm = createElement("div", "", "ddDiv");
                var ddc = createElement("div", "", "ddContainer");
                for (var i in langObj) {
                    if (langObj[i].attributes != undefined) {
                        var curr = createElement("div", langObj[i].getAttribute("value"), langObj[i].getAttribute("key"), "ddOpt translatable");
                        ddc.appendChild(curr);
                        curr.onclick = translate;
                    }
                }
                appendChildren(ddm, [createElement("button", "Translate", "ddButton", "translatable"),ddc]);
                holdNav.appendChild(ddm);
            }
            else if (this.readyState == 4) {console.log(this.status);};
        };
        req2.open("POST", "https://translate.yandex.net/api/v1.5/tr/getLangs?key=trnsl.1.1.20190311T164242Z.a3ee938d0c540e06.58e36ab370c756038a42d6b4148e9e68101881f7&ui=en", "true");
	    req2.send();
        var holdNav = createElement("div","","nav");
        appendChildren(holdNav, [createLink("Home",      "homeLink", jsonData.links.index, false, "translatable"), createLink("Projects",  "projLink", jsonData.links.projects, false, "translatable"), createLink("Resume",    "resLink",  jsonData.links.resume, false, "translatable")]);
        var holdHead = document.getElementById("header");
        appendChildren(holdHead, [createElement("h2", jsonData.headerData.name, "headName"), createLink(jsonData.headerData.email, "email", "mailto:" + jsonData.headerData.email, "blank"), createElement("span", jsonData.headerData.phone, "phone"), holdNav]);
        var holdFoot = document.getElementById("footer");
        appendChildren(holdFoot, [createElement("span", jsonData.footerData.text, "footText", "translatable"), createLink(jsonData.footerData.linkText, "footLink", jsonData.footerData.linkAddr, true)]);
        if(      document.getElementById("title").innerHTML == "Projects")  {getJSON("projects.json").then(results => {loadProjects(results)});}
        else if (document.getElementById("title").innerHTML == "Home")      {getJSON("home.json").then(results => {loadHome(results)});}
        else if (document.getElementById("title").innerHTML == "Resume")    {getJSON("resume.json").then(results => {loadResume(results)});}
	  } 
	};
	req.open("GET", "index.json", true);
	req.send();
}

document.onkeydown = function (e) {
    if (document.getElementById("imgDiv") != undefined) {
        if (e.keyCode == '37' ) {nextPic(document.getElementById("nextPic").data);}
        else if (e.keyCode == '39') {prevPic(document.getElementById("nextPic").data);}
    }
} 

function loadHome(json) {
    var pDiv = createElement("div", "", "pDiv");
    appendChildren(pDiv, [createImageWithProps("selfPic", json.home.picture, "Sam Murray", ["float", "marginRight", "marginBottom"], ["left", "1vw", "1em"]), createElement("h3", "About Me:", "parHead", "translatable")]);
    for (var i in json.home.paragraphs) {pDiv.appendChild(createElementWithStyleProps("p", json.home.paragraphs[i].item, "pDiv" + i, ["textIndent"], ["2rem"], "translatable"));}
    document.getElementById("content").insertBefore(pDiv, document.getElementById("footer"));
/*    var newsDiv = createElementWithStyleProps("div", "", "newsDiv", ["marginTop"], ["2rem"]);
	newsDiv.appendChild(createElement("h3", "Recent News:", "newsHead", "translatable"));
    var newsList = newsDiv.appendChild(createElement("ul", "", "newsList"));
    for (var i in json.home.news) {newsList.appendChild(createElement("li", json.home.news[i].item, "newsItem" + i, "translatable"));}
    document.getElementById("content").insertBefore(newsDiv, document.getElementById("footer"));*/
}

function loadProjects(json) {
console.log(json);
    var projDiv = createElement("div", "", "projDiv");
	projDiv.appendChild(createElement("h3", "Projects:", "projHead", "translatable"));
	for (var i in json.projects) {
    	var currDiv = createElement("div", "", "projDiv" + i);
    	var currImg = createImageWithProps("projImg" + i, json.projects[i].images[0].item, json.projects[i].title,["width", "float", "marginRight", "clear", "verticalAlign"], ["3em", "left", "1vw", "left", "middle"], "lbImg");
    	currImg.onclick = function(){lb(this, json);};
    	appendChildren(currDiv, [currImg, createElementWithStyleProps("div", json.projects[i].title, "projTit" + i, ["fontWeight"], ["bold"], "translatable"), createElement("div", json.projects[i].desc, "projDesc" + i, "translatable"), createElementWithStyleProps("div", "", "fill" + i, ["clear", "marginBottom"], ["both", "1em"])]);
		projDiv.appendChild(currDiv);
	}
    document.getElementById("content").insertBefore(projDiv, document.getElementById("footer"));
}

function lb(obj, json) {
    var idx = obj.id.substring(obj.id.length-1);
    var imgDiv;
    if (document.getElementById("imgDiv") == undefined) {
        imgDiv = createElementWithStyleProps("div", "", "imgDiv", ["backgroundColor", "position", "top", "left", "height", "width"], ["rgba(97, 105, 119, .5)", "fixed", "0", "0", "100%", "100%"]);
        var projImg = createImageWithProps("projImg", json.projects[idx].images[1].item, json.projects[idx].title,["position", "marginTop", "verticalAlign", "zIndex", "height", "display", "marginLeft", "marginRight"], ["relative", "10vh", "middle", ".9", "80%", "block", "auto", "auto"]);
        imgDiv.appendChild(projImg);
        var close = createElementWithStyleProps("button", "X", "close", ["position", "top", "right", "zIndex"], ["fixed", "11vh", "5vw", "1"])
        close.onclick = function(){imgDiv.style.visibility = "hidden";};
        close.data = 1;
        var right = createElementWithStyleProps("button",">", "nextPic", ["position", "top", "right", "zIndex"], ["fixed", "50vh", "5vw", "1"]);
        right.onclick = function(){nextPic(json.projects[idx], idx);};
        right.data = json.projects[idx];
        var left = createElementWithStyleProps("button","<", "prevPic", ["position", "top", "left", "zIndex"], ["fixed", "50vh", "5vw", "1"]);
        left.onclick = function(){prevPic(json.projects[idx], idx);};
        imgDiv.appendChild(createElementWithStyleProps("div", json.projects[idx].title + "\t\t(1/" + (json.projects[idx].images.length -1) + ")<br />" + json.projects[idx].desc, "desc", ["margin", "width", "textAlign", "position", "color", "zIndex", "bottom", "paddingLeft", "backgroundColor", "paddingTop", "paddingRight", "fontSize"], ["0 auto", "40%", "center", "absolute", "white", "1", "1vh", "30%", "rgba(0,0,0,.7)", ".5%", "32%", "110%"]));
        appendChildren(imgDiv, [close, right, left]);
        document.getElementById("content").appendChild(imgDiv);
    }
    else {
        imgDiv = document.getElementById("imgDiv"); 
        document.getElementById("projImg").src = json.projects[idx].images[1].item;
        imgDiv.style.visibility = "visible";
        document.getElementById("desc").innerHTML = json.projects[idx].title + "\t\t(1/" + (json.projects[idx].images.length -1 + ")<br />" + json.projects[idx].desc);
        document.getElementById("nextPic").onclick = function(){nextPic(json.projects[idx]);};
        document.getElementById("prevPic").onclick = function(){prevPic(json.projects[idx]);};
        document.getElementById("close").onclick = function(){imgDiv.style.visibility = "hidden";};
        document.getElementById("nextPic").data = json.projects[idx];
        document.getElementById("close").data = 1;
    }
}

function getJSON(addr, id) {
	var p = new Promise((resolve,reject) => {
		var req = new XMLHttpRequest();
		req.onreadystatechange = function() {
			if(req.readyState ==4 && req.status ==200) {
			    if (id == undefined) {resolve(JSON.parse(this.responseText));}
			    else {resolve([JSON.parse(this.responseText), id]);}
			}
			else if (req.status == 4) {
			    var error;
			    switch (req.readyState) {
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


function loadResume(json) {
    var eduDiv = createElement("div", "", "eduDiv"); 
    eduDiv.appendChild(createElement("h3", "Education", "eduHead", "translatable"));
    var eduList = eduDiv.appendChild(createElement("ul", "", "eduList"));
    for (var i in json.resume.education) {
        if (typeof json.resume.education[i] == "object") {
            var innerList = createElement("ul", "", "SAList");
            appendChildren(innerList, [createElement("li", json.resume.education[i].jterm, "jterm", "translatable"), createElement("li", json.resume.education[i].semester, "semester", "translatable")]);
            appendChildren(eduList, [createElement("li", json.resume.education[i].value, "edu" + i, "translatable"), innerList]);
        }
        else {
            if ((json.resume.education[i]).indexOf("University") >= 0) {
                var ele = createElement("li", "", "edu" + i);
                ele.appendChild(createLink(json.resume.education[i], "ustLink", "http://stthomas.edu", true, "translatable"));
                eduList.appendChild(ele);
            }
            else if (json.resume.education[i].indexOf("Aquinas") >= 0) {
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
    for (i in json.resume.work) {
        var currEl = createElement("li", "", "work" + i);
        var ele = createElementWithStyleProps("li", "", "link" + i, ["paddingTop", "display", "cssFloat"], [".5rem", "block", "left"]);
        ele.appendChild(createLink(json.resume.work[i].comp, json.resume.work[i].comp + "Link", json.resume.work[i].link, true, "translatable"));
        appendChildren(currEl, [ele, createElementWithStyleProps("span", json.resume.work[i].loca, "workLoca" + i, ["display", "textAlign", "cssFloat", "paddingTop"], ["block", "right", "right", ".5rem"], "translatable")]); 
        if (typeof json.resume.work[i].date == "object") {for (j in json.resume.work[i].date) {appendChildren(currEl, [createElementWithStyleProps("div",json.resume.work[i].date[j].time,"workDate"+i+"_"+j,["clear","display","textAlign","cssFloat"],["both","block","right","right"], "translatable"), createElementWithStyleProps("div",json.resume.work[i].title[j].data,"workTit"+i+"_"+j,["display","clear","paddingLeft","fontStyle"],["block","left","2vw","italic"], "translatable"), createElementWithStyleProps("div", json.resume.work[i].resp[j].info, "workResp" + i + "_" + j, ["paddingLeft"], ["4vw"], "translatable")]);}}
        else if (typeof json.resume.work[i].title == "object") {
            currEl.appendChild(createElementWithStyleProps("div", json.resume.work[i].date, "workDate" + i, ["clear", "display", "textAlign", "cssFloat"], ["both", "block", "right", "right"], "translatable"));
            for (j in json.resume.work[i].title) {appendChildren(currEl, [createElementWithStyleProps("div",json.resume.work[i].title[j].data,"workTit"+i+"_"+j,["display","clear","paddingLeft","fontStyle"],["block","left","2vw","italic"], "translatable"), createElementWithStyleProps("div", json.resume.work[i].resp[j].info, "workResp" + i + "_" + j, ["paddingLeft"], ["4vw"], "translatable")]);}
        }
        else {appendChildren(currEl, [createElementWithStyleProps("div", json.resume.work[i].date, "workDate" + i, ["clear", "display", "textAlign", "cssFloat"], ["both", "block", "right", "right"], "translatable"), createElementWithStyleProps("div", json.resume.work[i].title, "workTit" + i, ["display", "clear", "paddingLeft", "fontStyle"], ["block", "left", "2vw", "italic"], "translatable"), createElementWithStyleProps("div", json.resume.work[i].resp, "workResp" + i, ["paddingLeft"], ["4vw"], "translatable")]);}
        workList.appendChild(currEl);             
    }
    document.getElementById("content").insertBefore(workDiv, document.getElementById("footer"));

    var leadDiv = createElementWithStyleProps("div", "", "leadDiv", ["marginTop"], ["2em"]);
    leadDiv.appendChild(createElement("h3", "Leadership, Activities, & Honors", "leadHead", "translatable"));
    var leadList = leadDiv.appendChild(createElement("ul", "", "leadList"));
    for (i in json.resume.leadership) {
	    if (typeof json.resume.leadership[i].data == "object") {
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

function appendChildren(parent, children) {for (var i in children){parent.appendChild(children[i]);}}

function createElement(type, content, id, className) {
	var element1 = document.createElement(type);
	element1.innerHTML = content;
	element1.id = id;
	element1.className = className;
	element1.engData = content;
	return element1;
}

function createElementWithStyleProps(type, content, id, props, values, className) {
    var result = createElement(type, content, id, className);
    for (var i in props) {result.style[props[i]] = values[i];}
    return result;
}

function createImageWithProps(id, src, alt, props, vals, className) {
    var result = createElement("img", "", id);
    result.src = src;
    result.alt = alt;
    result.className = className;
    for (var i in props) {result.style[props[i]] = vals[i];}
    return result;
}

function createLink(content, id, addr, blankTF, className) {
    var result = createElement("a", content, id, className);
    result.href = addr;
    if (blankTF) {result.target = "blank";}
    return result;
}

function nextPic(info) {
    var imgIdx = Math.max(1,(document.getElementById("close").data + 1) % info.images.length);
    document.getElementById("projImg").src = info.images[imgIdx].item;
    document.getElementById("close").data = imgIdx;
    document.getElementById("desc").innerHTML = info.title + "\t\t(" + imgIdx + "/" + (info.images.length -1) + ")<br />" + info.desc;
}

function prevPic(info) {
    var imgIdx = document.getElementById("close").data - 1;
    if (imgIdx == 0) {imgIdx = info.images.length-1;}
    document.getElementById("projImg").src = info.images[imgIdx].item;
    document.getElementById("close").data = imgIdx;
    document.getElementById("desc").innerHTML = info.title + "\t\t(" + imgIdx + "/" + (info.images.length -1) + ")<br />" + info.desc;
}   

function translate() {
    var els = document.getElementsByClassName("translatable");
    for (var i in els) {if(els[i].id != undefined) {getJSON("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190311T164242Z.a3ee938d0c540e06.58e36ab370c756038a42d6b4148e9e68101881f7&text=" + encodeURI(els[i].engData) + "&lang=" + this.id, els[i].id).then(results => {document.getElementById(results[1]).innerHTML = results[0].text[0];});}}
}
