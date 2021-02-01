/** Returns an array of `length` with values of `value` */
function filledArray(value, length) {
    return Array(length).fill(value)
}

/** Shuffles the given array in place*/
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function Party(name, color) {
    this.name = name
    this.color = color

    this.equalTo = function(other) {
        return this.name == other.name;
    }
}

const BLUE = new Party('blue', '#5868aa');
const RED = new Party('red', '#f95955');
const TIE = new Party('tie', '#000000');
