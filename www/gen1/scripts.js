var lookupTable = new Map();
//const lookupTableURL = "http://localhost:8000/gen1/lookup.tsv";
const lookupTableURL = "https://supermetalmons.xyz/gen1/lookup.tsv";
var lookupFlag = false; //This will become true when the lookup table is done being built

var template = null;

var base = 0;
const defaultBase = 0;
var catalogCount = 6;
const defaultCatalogCount = 6;
const max = 145;
const min = 1;

window.addEventListener('load', (event) => {
    //Load all of the URLs in the lookup table
    httpGet(lookupTableURL);

    //Check if we have a saved place in the catalog
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

    template = $("#template");
    template.detach();
    template.removeAttr('id');

    applyConfines();

    if(base <= 0) {
        $("#nextButton").show();
        $("#prevButton").hide();
    } else if(base > max - catalogCount) {
        $("#nextButton").hide();
        $("#prevButton").show();
    } else {
        $("#nextButton").show();
        $("#prevButton").show();
    }

    buildCatalog(base, catalogCount);
});

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
    if(base <= min) {
        base = min;
        $("#prevButton").hide();
    }

    localStorage.setItem('base', base);

    buildCatalog(base, catalogCount);
}

function setup(file) {
    file.split(/\r?\n/).forEach(line => {
        elms = line.split(/(\s+)/);
        lookupTable.set(elms[0], elms[2]);
    });

    lookupFlag = true;
}

function httpGet(url) {
    var xmlhttp;

    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            setup(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}

function buildCatalog(base, catalogCount) {
    $("#catalog").empty();

    let check = function() {
        setTimeout(function() {
            if(!lookupFlag || template == null) {
                check();
            }  else {
                for(var i = 0; i < catalogCount; i++)
                    buildItem(i + base);
            }
        }, 500);
    }
    check();
}

function buildItem(index) {
    var indexString = index.toString();
    indexString = indexString.padStart(3, "0");
    var elm = template.clone();

    if(index > max || index <= 0) {
        elm.find(".image").attr("src", "https://via.placeholder.com/500x500");
    } else {
        elm.find(".image").attr("src", "../pix/" + indexString + ".JPG");
        elm.find(".link").attr("href", lookupTable.get(indexString));
        
    }

    console.log(elm);

    $("#catalog").append(elm);
}

function applyConfines() {
    if(base <= min)
        base = min;
    if(base >= max - catalogCount)
        base = max - catalogCount;
}