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

var states = [ // states must be in same order as they are in data years
    ['tx', 'Texas'],
    ['az', 'Arizona'],
    ['wa', 'Washington'],
    ['nv', 'Nevada'],
    ['or', 'Oregon']
];


// -- ELEMENTS -- //

var yearSelect = document.getElementsByClassName('year-select')[0];
var stateSelect = document.getElementsByClassName('state-select')[0];

var mapSection = document.getElementsByClassName('map-section')[0];
var map = mapSection.getElementsByClassName('map-svg')[0];

var mapDialogBox = mapSection.getElementsByClassName('map-dialog')[0];

var mapStatesText = [];
var mapEnabledStates = states.map(el => {
    var element = mapSection.getElementsByClassName(el[0])[0];
    var elementBBox = element.getBBox();
    var text = mapSection.getElementsByClassName(el[0]+'-txt')[0];
    
    text.setAttribute('x', elementBBox.x + elementBBox.width * 0.3);
    text.setAttribute('y', elementBBox.y + elementBBox.height * 0.5);

    mapStatesText.push(text);
    element.classList.add('state-enabled');
    return element;
});


var embedBtn = document.getElementsByClassName('embed-btn')[0];
var embedCodeEl = document.getElementsByClassName('embed-code')[0];


// -- INIT -- //

var latestYear = 0;
for (const year in data) {

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
setYear(latestYear);

var embedCode = `<iframe src="${window.location.href}" frameborder="0" scrolling="no" class="unvlmap-iframe" allowfullscreen></iframe>`;
embedCodeEl.innerText = embedCode;

var zoomedState = 'none';

///////////////////////////////////////////


function setYear(year) {
    var value;
    console.log(mapStatesText);
    console.log(year);
    mapStatesText.forEach((state, i) => {
        value = data[year][i] / 1000;
        value = value.toFixed(2);
        mapEnabledStates[i].style = `opacity: ${(value/100).toFixed(1)};`
        value = value + "K";
        state.textContent = value;
        
        
    })
}

function updateBox(year) {
    if (zoomedState === 'none') return;
    var index = states.findIndex(el => el[0] === zoomedState);
    var state = states[state][1];
    mapDialogBox.innerText = `${data[year][index]} people moved to ${state} in ${year}`;
}

function onSelect(e){
    var year = yearSelect.value;

    var value = e.target.classList[0] || e.target.value || 'none';
    if (value === zoomedState || value.substring(0,2) === zoomedState) {
        zoomOut();
        zoomedState = 'none';
        return;
    }

    var mapBox = map.getBBox();
    var stateBox = document.getElementsByClassName(value)[0].getBBox();    

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
        let last = document.getElementsByClassName(zoomedState)[0];
        if (last !== undefined) {
            last.classList.remove('state-active');
        }
        zoomedState = value;
        mapEnabledStates[index].classList.add('state-active');
    }

    function zoomOut() {
        mapDialogBox.classList.remove('active');
        map.style = "";
        map.classList.remove('zoom');
        let last = document.getElementsByClassName(zoomedState)[0];
        if (last !== undefined) {
            last.classList.remove('state-active');
        }
    }

    let stateIndex = states.findIndex(el => el[0] === value || el[0]+'-txt' === value);
    if (stateIndex < 0) {
        zoomOut();
    }
    else {   
        action( states[stateIndex][0], states[stateIndex][1], stateIndex);
    }
}

function showEmbedCode(e) {
    embedCodeEl.style.display = 'inline-block';
    e.target.disabled = true;
}

let lastHovered = 'none'

function onHover(e) {
    let current = e.target.classList[0]?e.target.classList[0]:"none";
    if (current.length === 6) {
        current = current.substring(0, 2);
    }
    if (lastHovered !== current) {
        let lastIndex = states.findIndex(el => el[0] === lastHovered);
        let currentIndex = states.findIndex(el => el[0] === current);
        if(lastIndex>-1)mapEnabledStates[lastIndex].style.fill = "";
        if (currentIndex > -1) { mapEnabledStates[currentIndex].style.fill = "blue"; }
        lastHovered = current;

    }
}
map.addEventListener('click', onSelect);
map.addEventListener('mouseover', e => { onHover(e); })
map.addEventListener('mouseleave', e=>{lastHovered='none'})

stateSelect.addEventListener('change', onSelect);
yearSelect.addEventListener('change', e => { setYear(e.target.value); updateBox(e.target.value) });
embedBtn.addEventListener('click', showEmbedCode);

