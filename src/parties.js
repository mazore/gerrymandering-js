import { lighten } from './helpers/functions.js';

function Party(name, color) {
    this.name = name;
    this.color1 = color; // Person color, darker
    this.color2 = lighten(color, 0.7); // District color, lighter

    this.equalTo = (other) => this.name === other.name;
    this.netAdvantage = (ps) => (this.equalTo(ps.HELP_PARTY) ? 1 : -1);
}

export const BLUE = new Party('blue', 'rgb(88, 104, 170)');
export const RED = new Party('red', 'rgb(249, 89, 85)');
export const TIE = new Party('tie', 'rgb(51, 51, 51)');
