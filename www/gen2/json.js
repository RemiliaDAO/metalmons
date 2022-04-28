var url = "https://supermetalmons.xyz/mons/json/";
//var url = "http://localhost:8000/supermetalmons.xyz/mons/json/";
var shopUrl = "https://opensea.io/assets/0x17abd4cc1382397ec2b675f98621c3ba809897de/";

var elements = [];
var template = null;
const defaultBase = 0;
var base;
const defaultCatalogCount = 6;
var catalogCount;
const max = 776;

function init() {
    if(typeof window.localStorage != 'undefined') {
        base = parseInt(localStorage.getItem('base'));
        catalogCount = parseInt(localStorage.getItem('catalogCount'));

        if(!base) {
            localStorage.setItem('base', defaultBase);
            base = defaultBase;
        }

        if(!catalogCount) {
            localStorage.setItem('catalogCount', defaultCatalogCount);
            catalogCount = defaultCatalogCount;
        }
    } else {
        base = defaultBase;
        catalogCount = defaultCatalogCount;
    }
    
}

window.addEventListener('load', (e) => {
    init();

    template = $("#template");
    template.detach();
    template.removeAttr('id');

    buildCatalog(base, catalogCount); //Initialize the catalog

    if(base <= 0) {
        $("#nextButton").show();
        $("#prevButton").hide();
    } else if(base >= max - catalogCount) {
        $("#nextButton").hide();
        $("#prevButton").show();
    } else {
        $("#nextButton").show();
        $("#prevButton").show();
    }
});

window.addEventListener("jsonLoad", function(e) {
    buildFromJSON(JSON.parse(e.detail[0]), elements, e.detail[1]);
}, false);

function httpGet(url, index) {
    var xmlhttp;

    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            window.dispatchEvent(new CustomEvent("jsonLoad", {detail: [xmlhttp.responseText, index]}));
        }
    }

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}

function buildFromJSON(json, output, index) {
    let check = function() {
            setTimeout(function() {
            if(template === null) {
                check();
            } else {
                var element = template.clone();
                element.find(".name").text(json.name);
                element.find(".image").attr("src", json.image);
                element.find(".description").text(json.description);
                element.find(".link").attr("href", shopUrl + index);
                output.push(element);
            }
        }, 500);
    }

    check();
}

function buildCatalog(base, count) {
    elements = [];
    $("#catalog").empty();

    for(var i = 0; i < count; i++) {
        httpGet(url + (i + base), (i + base));
    }

    let check = function() {
        setTimeout(function() {
            if(elements.length < count) {
                check();
            }  else {
                elements.forEach(elm => $("#catalog").append(elm));
            }
        }, 500);
    }
    check();
}

function nextButton() {
    $("#nextButton").show();
    $("#prevButton").show();

    base += catalogCount;
    if(base >= max - catalogCount) {
        base = max - catalogCount;
        $("#nextButton").hide();
    }

    localStorage.setItem('base', base);

    buildCatalog(base, catalogCount);
}

function prevButton() {
    $("#nextButton").show();
    $("#prevButton").show();

    base -= catalogCount;
    if(base <= 0) {
        base = 0;
        $("#prevButton").hide();
    }

    localStorage.setItem('base', base);

    buildCatalog(base, catalogCount);
}