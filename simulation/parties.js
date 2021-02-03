function Party(name, color) {
    this.name = name
    this.color = color

    this.equalTo = function(other) {
        return this.name == other.name;
    }
}

const BLUE = new Party('blue', '#5868aa');
const RED = new Party('red', '#f95955');
const TIE = new Party('tie', '#333');
