function Party(name, color) {
    this.name = name
    this.color1 = color // Person color, darker
    this.color2 = lighten(color, 0.55) // District color, lighter

    this.equalTo = function(other) {
        return this.name == other.name;
    }
}

/** Returns r, g, and b channels (strings) from 'rgb(r, g, b)' string */
function getRGB(str) {
    return str.match(/\d+/g);
}

/** Returns 'rgb(r, g, b)' string that is `percent` percent towards white, 1 being white, 0 being no change */
function lighten(str, percent) {
    let [r, g, b] = getRGB(str);
    r = parseInt(r) + (255 - r)*percent;
    g = parseInt(g) + (255 - g)*percent;
    b = parseInt(b) + (255 - b)*percent;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const BLUE = new Party('blue', 'rgb(88, 104, 170)');
const RED = new Party('red', 'rgb(249, 89, 85)');
const TIE = new Party('tie', 'rgb(51, 51, 51)');
