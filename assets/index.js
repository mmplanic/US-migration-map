// -- DATA -- //

var data = {
//  year : [0]-texas, [1]-arizona, [2]-washington, [3]-nevada, [4]-oregon
   
    2020: [82_235, 59_713, 46_791, 47_322, 37_927], // estimated
    2019: [82_235, 59_713, 46_791, 47_322, 37_927],
    2018: [86_164, 68_516, 55_467, 50_707, 43_058],
    2017: [63_174, 59_233, 52_484, 47_513, 50_109],
    2016: [69_945, 64_756, 51_485, 45_482, 43_804],
    2015: [65_546, 54_646, 45_609, 54_765, 40_447],
    2014: [63_591, 57_446, 40_085, 48_954, 35_334],
    2013: [66_318, 47_959, 37_150, 47_897, 31_380],
    2012: [62_702, 44_889, 45_597, 49_978, 31_862],
    2011: [58_992, 49_635, 38_421, 40_114, 34_214],
    2010: [68_959, 47_164, 39_468, 35_472, 34_190],
}
//total

var totalFor10Years = 2_544_669/10;

//regions

var texas10Years = 687_626 / totalFor10Years/10;
var arizona10Years = 553_957 / totalFor10Years/10;
var nevada10years = 452_557 / totalFor10Years/10;
var washington10Years = 468_204/ totalFor10Years/10;
var oregon10Years = 382_325 / totalFor10Years/10;

// -- ELEMENTS -- //

//  -- utils --//


// -- INIT -- //


//regions

var yearSelect = document.getElementsByClassName('year-select')[0];
var stateSelect = document.getElementsByClassName('state-select')[0];


var mapSection = document.getElementsByClassName('map-section')[0];
var map = document.getElementsByClassName('map-svg')[0];

var mapDialogBox = document.getElementsByClassName('map-dialog')[0];


var embedBtn = document.getElementsByClassName('embed-btn')[0];
var embedCodeEl = document.getElementsByClassName('embed-code')[0];

var latestYear = 0;
for (const year in data) {
    //const element = data[year];

    const option = document.createElement('option');
    option.value = year;
    option.innerText = year.toString();
    
    if (latestYear < year) {
        latestYear = year
        yearSelect.prepend(option);
    }
    else {
        yearSelect.append(option);
    }
}
yearSelect.value = latestYear;


var zoomedState = 'none';
function onSelect(e){
    var year = yearSelect.value;

    var value = e.target.className.baseVal || e.target.value || 'none';

    if (value === zoomedState) {
        zoomOut();
        zoomedState = 'none';
        return;
    }
    var mapBox = map.getBBox();
    var stateBox = document.getElementsByClassName(value)[0].getBBox();
     console.log(stateBox);

    // console.log(mapBox);
    // var ratio = mapSection.offsetWidth / mapBox.width;
    // var top = (mapSection.offsetHeight/2 - (stateBox.y + stateBox.height/2)*ratio);
    // var left = (mapSection.offsetWidth/2 - (stateBox.x + stateBox.width/2)*ratio);
    
    var ratio = mapSection.offsetWidth / mapBox.width;

    var top = (stateBox.y + stateBox.height / 2) / mapBox.height;
    var left = (stateBox.x + stateBox.width / 2) / mapBox.width;
    top = (top * mapSection.offsetHeight * 2) - mapSection.offsetHeight;
    left = (left * mapSection.offsetWidth * 2) - mapSection.offsetWidth;
    top *= -1;
    left *= -1;

    
    function action(value, state, index) {
        stateSelect.value = value;
        mapDialogBox.innerText = `${data[year][index]} people moved to ${state} in ${year}`;
        mapDialogBox.classList.add('active');
        map.classList.add('zoom');
        map.style.left = left;
        map.style.top = top;
        zoomedState = value;
    }
    function zoomOut() {
        mapDialogBox.classList.remove('active');
        map.style = "";
        map.classList.remove('zoom');
    }
    switch (value) {
        case 'tx': {
            action(value, 'Texas',0);
        }
            break;
        case 'az': {
            action(value, 'Arizona',1);
        }
            break;
        case 'wa':{
            action(value, 'Washington',2);
        }
        break;
        case 'nv':{
            action(value, 'Nevada',3);
        }
        break;
        case 'or':{
            action(value, 'Oregon',4);
        }
        break;

        default: {
            zoomOut();
            //action(value, 'Oregon',4);
        }
            break;
    }
}

map.addEventListener('click', onSelect);
stateSelect.addEventListener('change', onSelect);

function showEmbedCode(e) {
    embedCodeEl.style.display = 'inline-block';
    e.target.disabled = true;
}

embedBtn.addEventListener('click', showEmbedCode);

var embedCode = `<iframe src="${window.location.href}" frameborder="0" scrolling="no" class="unvlmap-iframe" allowfullscreen></iframe>`;
embedCodeEl.innerText = embedCode;
// --LOGIC--//

focusedState = 'none';



console.log(window.location.href);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


