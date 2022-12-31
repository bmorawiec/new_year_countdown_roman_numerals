var isTransitionPlaying = false;
var transitionOpacity = 0;

var yearCharacters = [];

var currentYearWidth, newYearWidth;
var currentYearX, newYearX;

var yearX, yearY;

var isYearLocked = false;

function createYearAnimation() {
    yearCharacters = getAnimatedCharacters(largeCharacterWidth, currentYearRoman, newYearRoman, FORE_COLOR, VERY_SLOW_EASING);

    currentYearWidth = currentYearRoman.length * largeCharacterWidth;
    newYearWidth = newYearRoman.length * largeCharacterWidth;
}

function playTransition() {
    isTransitionPlaying = true;
}

function renderTransition() {
    if (isTransitionPlaying) {
        if (isYearScreen) {
            transitionOpacity = easing(transitionOpacity, 0, SLOW_EASING, EP_HIGH);

            if (transitionOpacity == 0) {
                isTransitionPlaying = false;
            }
        } else {
            transitionOpacity = easing(transitionOpacity, 255, SLOW_EASING, EP_HIGH);

            if (transitionOpacity == 255) {
                isYearScreen = true;
                yearX = currentYearX;
            }
        }

        background(BACK_COLOR, transitionOpacity);
    }
}

function renderYearAnimation() {
    textSize(40);
    textFont("Source Code Pro");

    yearX = easing(yearX, newYearX, VERY_SLOW_EASING, EP_LOW);

    if (isYearLocked) {
        translate(newYearX, yearY);
    } else {
        translate(yearX, yearY);

        if (yearX == newYearX) {
            isYearLocked = true;
        }
    }

    for (var i = 0; i < yearCharacters.length; i++) {
        yearCharacters[i].render();
    }
}