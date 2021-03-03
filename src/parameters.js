import { BLUE, RED } from './parties.js';
import { roundToMultiple } from './helpers/functions.js';

/**
 * @param: SIMULATION_WIDTH - Width and height of simulation in pixels
 * @param: DISTRICT_SIZE - Number of people per district
 * @param: GRID_WIDTH - Width and height of grid of people
 * @param: HELP_PARTY - Party to help during the gerrymandering process
 * @param: FAVOR_TIE - Whether or not to try to make more tied districts
 * @param: TARGET_NUM_BLUE_DISTRICTS - Target number of districts to be won by blue
 * @param: PERCENT_RED - What percentage of people vote red (0 to 1)
 * @param: SHOW_MARGINS - Whether to set district color saturation based on victory margin
 *
 * @param: HINDER_PARTY - Party to hinder during the gerrymandering process
 * @param: STANCE_THRESHOLD - Where to divide people's stances, essentially number of red people
 * @param: SQUARE_WIDTH - Width of a grid square
 */
function Parameters() {
    this.SIMULATION_WIDTH = Math.min(window.innerWidth, 480);
    // this.DISTRICT_SIZE = 25;
    // this.GRID_WIDTH = 25;
    this.DISTRICT_SIZE = 9;
    this.GRID_WIDTH = 12;
    this.HELP_PARTY = BLUE;
    this.FAVOR_TIE = false;
    this.PERCENT_RED = 0.5;
    this.SHOW_MARGINS = false;

    this.NUM_PEOPLE = this.GRID_WIDTH ** 2;
    this.NUM_DISTRICTS = this.NUM_PEOPLE / this.DISTRICT_SIZE;
    // Make sure SQUARE_WIDTH is whole
    this.SIMULATION_WIDTH = roundToMultiple(this.SIMULATION_WIDTH, this.GRID_WIDTH);
    this.SQUARE_WIDTH = this.SIMULATION_WIDTH / this.GRID_WIDTH;
    this.setHinderParty = () => {
        this.HINDER_PARTY = this.HELP_PARTY.equalTo(RED) ? BLUE : RED;
    };
    this.setStanceThreshold = () => {
        this.STANCE_THRESHOLD = Math.floor(this.NUM_PEOPLE * this.PERCENT_RED + 0.5);
    };
    this.setTargetNumBlueDistricts = (percent) => {
        const notfloored = this.NUM_DISTRICTS * (1 - percent);
        this.TARGET_NUM_BLUE_DISTRICTS = Math.round(notfloored);
    };
    this.setHinderParty();
    this.setStanceThreshold();
    this.setTargetNumBlueDistricts(0.5);

    if (!Number.isInteger(Math.sqrt(this.DISTRICT_SIZE))) {
        throw new Error('districts start as squares, district_size must be a perfect square');
    }
    if (!Number.isInteger(Math.sqrt(this.NUM_DISTRICTS))) {
        throw new Error('districts must be able to fit into the grid without remainders');
    }
}
export default new Parameters();
