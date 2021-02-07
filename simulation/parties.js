function Party(name, color) {
    this.name = name
    this.color1 = color // Person color, darker
    this.color2 = lighten(color, 0.55) // District color, lighter

    this.equalTo = function(other) {
        return this.name == other.name;
    }
}

const BLUE = new Party('blue', 'rgb(88, 104, 170)');
const RED = new Party('red', 'rgb(249, 89, 85)');
const TIE = new Party('tie', 'rgb(51, 51, 51)');
