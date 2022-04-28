var lookupTable = new Map();
//const lookupTableURL = "http://localhost:8000/lookup.tsv";
const lookupTableURL = "https://supermetalmons.xyz/gen2/lookup.tsv";
var lookupFlag = false; //This will become true when the lookup table is done being built

var template = null;

var base = 0;
const defaultBase = 0;
var catalogCount = 6;
const defaultCatalogCount = 6;
const max = 144;

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
    if(base <= 0) {
        base = 0;
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
        elm.find(".name").text("To be announced");
        elm.find(".image").attr("src", "https://via.placeholder.com/500x500?text=More+coming+soon");
    } else {
        elm.find(".name").text(indexString);
        elm.find(".image").attr("src", "../pix/" + indexString + ".JPG");
        elm.find(".link").attr("href", lookupTable.get(indexString));
        
    }

    console.log(elm);

    $("#catalog").append(elm);
}