class UnitDisplay {
    y = 0;

    #string = "";
    #value = -1;

    unit = "";
    unitText = "";

    limit = 0;

    active = true;

    color = FORE_COLOR;
    chars = [];

    get value() {
        return this.#value;
    }

    set value(newValue) {
        if (this.active && this.#value != newValue) {
            if (newValue == 0) {
                // make the counter gray and disable it forever
                this.active = false;
                this.color = HALF_COLOR;
            }

            var limitedValue;

            if (this.limit == null) {
                limitedValue = newValue;
            } else {
                limitedValue = newValue % this.limit;
            }

            if (limitedValue == 1) {
                this.unitText = this.unit;
            } else {
                this.unitText = this.unit + "s";
            }

            this.string = convertToRoman(limitedValue);
    
            this.#value = newValue;
        }
    }

    get string() {
        return this.#string;
    }

    set string(newString) {
        this.chars = getAnimatedCharacters(characterWidth, this.#string, newString, this.color, FAST_EASING);
        this.#string = newString;
    }

    constructor(unit, y, limit) {
        this.unit = unit;
        this.y = y;
        this.limit = limit;
    }

    render() {
        push();
        translate(0, this.y);

        textStyle(BOLD);

        for (var i = 0; i < this.chars.length; i++) {
            this.chars[i].render();
        }
        
        fill(this.color);
    
        textStyle(NORMAL);
        text(this.unitText, 200, 0);

        pop();
    }
}

class AnimatedCharacter {
    position = 0;
    targetPosition = 0;

    animation;
    
    color = 0;
    opacity = 255;

    easing = 0;

    text = "";

    constructor(animation, color, easing, text, position, targetPosition) {
        this.animation = animation;
        this.color = color;
        this.text = text;
        this.position = position;
        this.easing = easing;

        if (this.animation == MOVE_ANIMATION) {
            this.targetPosition = targetPosition;
        } else if (this.animation == REMOVE_ANIMATION) {
            this.opacity = 255;
        } else {
            this.opacity = 0;
        }
    }

    render() {
        if (this.animation == MOVE_ANIMATION) {
            this.position = easing(this.position, this.targetPosition, this.easing, EP_HIGH);
        } else {
            if (this.animation == ADD_ANIMATION) {
                this.opacity = easing(this.opacity, 255, this.easing, EP_HIGH);
            } else {
                this.opacity = easing(this.opacity, 0, this.easing, EP_HIGH);
            }
        }


        fill(this.color, this.opacity);
        text(this.text, this.position, 0);
    }
}

function createDisplays() {
    weeksDisp = new UnitDisplay("week", 0);
    daysDisp = new UnitDisplay("day", 50, 7);
    hoursDisp = new UnitDisplay("hour", 100, 24);
    minutesDisp = new UnitDisplay("minute", 150, 60);
    secondsDisp = new UnitDisplay("second", 200, 60);

    displays = [weeksDisp, daysDisp, hoursDisp, minutesDisp, secondsDisp];
}

function renderDisplays() {
    push();
    translate(padding, padding);
 
    textFont("Source Code Pro");

    for (var i = 0; i < displays.length; i++) {
        displays[i].render();
    }

    textFont("Source Code Pro Light");
    text(yearString, 0, 280);

    pop();
}

// returns an array of animated characters ready to be displayed on screen
function getAnimatedCharacters(characterWidth, oldString, newString, color, easing) {
    var diff = compareStrings(oldString, newString);
    var chars = [];

    for (var i = 0; i < diff.add.length; i++) {
        var value = diff.add[i];

        if (value != null) {
            var char = new AnimatedCharacter(ADD_ANIMATION, color, easing, value, i * characterWidth);
            chars.push(char);
        }
    }

    for (var i = 0; i < diff.remove.length; i++) {
        var value = diff.remove[i];

        if (value != null) {
            var char = new AnimatedCharacter(REMOVE_ANIMATION, color, easing, value, i * characterWidth);
            chars.push(char);
        }
    }

    for (var i = 0; i < diff.move.length; i++) {
        var data = diff.move[i];

        if (data != null) {    
            var char = new AnimatedCharacter(MOVE_ANIMATION, color, easing, data[1], i * characterWidth, data[0] * characterWidth);

            chars.push(char);
        }
    }

    return chars;
}