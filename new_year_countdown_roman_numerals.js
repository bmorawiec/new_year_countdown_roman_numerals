const ROMAN_LOOKUP = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };

const MOVE_ANIMATION = 0;
const REMOVE_ANIMATION = 1;
const ADD_ANIMATION = 2;

const FAST_EASING = 0.1;
const SLOW_EASING = 0.05;
const VERY_SLOW_EASING = 0.01;

const EP_LOW = 0.1;
const EP_HIGH = 1;

const BACK_COLOR = 10;
const HALF_COLOR = 130;
const FORE_COLOR = 200;

var padding;

var weeksDisp, daysDisp, hoursDisp, minutesDisp, secondsDisp;
var displays = [];

var characterWidth, largeCharacterWidth;

var yearString = "";
var newYearDate;
var currentYearRoman, newYearRoman;

var isYearScreen = false;
var yearScreenTransition;

function setup() {
    textFont("Source Code Pro");
    textAlign(LEFT, TOP);

    textSize(80);
    largeCharacterWidth = textWidth("X");

    textSize(20);
    characterWidth = textWidth("X");

    var currentYear = new Date().getFullYear();
    var nextYear = currentYear + 1;
    var timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    currentYearRoman = convertToRoman(currentYear);
    newYearRoman = convertToRoman(nextYear);

    newYearDate = new Date(nextYear, 0, 1, 0, 0, 0);

    yearString = "...left until " + newYearRoman + " (" + timeZoneName + ")";

    createYearAnimation();
    createDisplays();

    windowResized();
}

function draw() {
    background(BACK_COLOR);
    fill(FORE_COLOR);
    noStroke();

    if (isYearScreen) {
        renderYearAnimation();
    } else {
        updateDisplays();
        renderDisplays();
    }

    renderTransition();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    currentYearX = (width - currentYearWidth) / 2;
    newYearX = (width - newYearWidth) / 2;

    yearY = (height - 40) / 2;

    padding = (height - 300) / 2;
}

function updateDisplays() {
    var now = Date.now();
    var diff = newYearDate - now;

    var seconds = floor(diff / 1000);
    var minutes = floor(seconds / 60);
    var hours = floor(minutes / 60);
    var days = floor(hours / 24);
    var weeks = floor(days / 7);
    
    secondsDisp.value = seconds;
    minutesDisp.value = minutes;
    hoursDisp.value = hours;
    daysDisp.value = days;
    weeksDisp.value = weeks;

    if (seconds <= -1 && !isTransitionPlaying) {
        playTransition();
    }
}

function convertToRoman(num) {
    if (num == 0) {
        return "zero";
    }

    var roman = "";
    var field;

    for (field in ROMAN_LOOKUP) {
        while (num >= ROMAN_LOOKUP[field]) {
            roman += field;
            num -= ROMAN_LOOKUP[field];
        }
    }

    return roman;
}

// returns the difference between the two given strings
//      add         the characters that need to be added to the 1st string
//      remove      the characters that need to be removed from the 1st string
//      move        the characters that need to be moved to a different place in the string
function compareStrings(a, b) {
    var remove = a.split("");
    var add = b.split("");
    var move = [];

    for (var i = 0; i < remove.length; i++) {
        var j = add.indexOf(remove[i]);

        if (j != -1) {
            move[i] = [j, remove[i]];
            add[j] = null;
            remove[i] = null;
        }
    }

    return { add: add, remove: remove, move: move };
}

function easing(origin, target, easing, precision) {
    if (origin == target || round(origin * precision) == round(target * precision)) {
        return target;
    } else {
        return origin + (target - origin) * easing;
    }
}