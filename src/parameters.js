import { BLUE, RED } from './parties.js';

function Parameters() {
    this.SIMULATION_WIDTH = 480; // Width and height of simulation in pixels */
    this.DISTRICT_SIZE = 16; // Number of people per district
    this.GRID_WIDTH = 24; // Width and height of grid of people
    this.HELP_PARTY = BLUE; // Party to hinder during the gerrymandering process
    this.FAVOR_TIE = false; // Whether or not to try to make more tied districts
    this.PERCENT_BLUE = 50; // What percent of people vote blue
    this.SHOW_MARGINS = false; // Whether to set district color saturation based on victory margin

    // HINDER_PARTY - Party to hinder during the gerrymandering process
    this.HINDER_PARTY = this.HELP_PARTY.equalTo(RED) ? BLUE : RED;
    this.NUM_PEOPLE = this.GRID_WIDTH ** 2; // Number of people
    this.NUM_DISTRICTS = this.NUM_PEOPLE / this.DISTRICT_SIZE; // Number of districts
    // STANCE_THRESHOLD - Where to divide people's stances
    this.STANCE_THRESHOLD = Math.floor(this.NUM_PEOPLE * (this.PERCENT_BLUE / 100) - 0.5);
    this.SQUARE_WIDTH = this.SIMULATION_WIDTH / this.GRID_WIDTH; // Width of a person square

    if (!Number.isInteger(Math.sqrt(this.DISTRICT_SIZE))) {
        throw new Error('districts start as squares, district_size must be a perfect square');
    }
    if (!Number.isInteger(Math.sqrt(this.NUM_DISTRICTS))) {
        throw new Error('districts must be able to fit into the grid without remainders');
    }
}
export default new Parameters();
