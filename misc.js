function arrayOf(length, value) {
    return Array(length).fill(value)
}

function shuffled(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function Party(name, color) {
    this.name = name
    this.color = color

    this.equalTo = function(other) {
        return this.name == other.name;
    }
}

BLUE = new Party('blue', '#5868aa');
RED = new Party('red', '#f95955');
TIE = new Party('tie', '#000000');
