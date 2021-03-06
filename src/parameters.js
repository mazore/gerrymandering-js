import { BLUE, RED } from './parties.js';

/**
 * @param: DISTRICT_SIZE - Number of people per district
 * @param: GRID_WIDTH - Width and height of grid of people
 * @param: MAX_SIMULATION_WIDTH - Maximum of SIMULATION_WIDTH
 * @param: SIMULATION_WIDTH - Width and height of simulation in pixels
 * @param: HELP_PARTY - Party to help during the gerrymandering process
 * @param: FAVOR_TIE - Whether or not to try to make more tied districts
 * @param: TARGET_NUM_BLUE_DISTRICTS - Target number of districts to be won by blue
 * @param: PERCENT_RED - What percentage of people vote red (0 to 1)
 * @param: SHOW_MARGINS - Whether to set district color saturation based on victory margin
 * @param: LINE_WIDTH - How wide the lines that divide districts are
 *
 * @param: HINDER_PARTY - Party to hinder during the gerrymandering process
 * @param: STANCE_THRESHOLD - Where to divide people's stances, essentially number of red people
 * @param: SQUARE_WIDTH - Width of a grid square
 */
function Parameters() {
    // this.DISTRICT_SIZE = 25;
    // this.GRID_WIDTH = 25;
    // this.DISTRICT_SIZE = 16;
    // this.GRID_WIDTH = 24;
    this.DISTRICT_SIZE = 9;
    this.GRID_WIDTH = 12;

    this.MAX_SIMULATION_WIDTH = 432;
    this.HELP_PARTY = BLUE;
    this.FAVOR_TIE = false;
    this.PERCENT_RED = 0.5;
    this.SHOW_MARGINS = false;

    this.onGridWidthSet = () => {
        this.NUM_PEOPLE = this.GRID_WIDTH ** 2;
        this.NUM_DISTRICTS = this.NUM_PEOPLE / this.DISTRICT_SIZE;

        this.SIMULATION_WIDTH = Math.min(window.innerWidth, this.MAX_SIMULATION_WIDTH);
        this.SQUARE_WIDTH = this.SIMULATION_WIDTH / this.GRID_WIDTH;

        this.setStanceThreshold();
        this.setLineWidth();
    };
    /** Sets the  */
    this.setStanceThreshold = () => {
        this.STANCE_THRESHOLD = Math.floor(this.NUM_PEOPLE * this.PERCENT_RED + 0.5);
    };
    /** Dynamically set line width based on square how big squares are */
    this.setLineWidth = () => {
        this.LINE_WIDTH = Math.round(this.SQUARE_WIDTH / 8);
    };
    /** Sets HINDER_PARTY to the opposite of HELP_PARTY */
    this.setHinderParty = () => {
        this.HINDER_PARTY = this.HELP_PARTY.equalTo(RED) ? BLUE : RED;
    };
    /** Sets the number of blue districts we try to get, based on a percent of all districts */
    this.setTargetNumBlueDistricts = (percent) => {
        const notRounded = this.NUM_DISTRICTS * percent;
        this.TARGET_NUM_BLUE_DISTRICTS = Math.round(notRounded);
    };
    /** Sets target number of blue districts based on simulation */
    this.defaultTargetNumBlueDistricts = (simulation) => {
        const percent = simulation.score.get(BLUE) / this.NUM_DISTRICTS;
        this.setTargetNumBlueDistricts(percent);
    };

    this.onGridWidthSet();
    this.setHinderParty();
    this.setLineWidth();

    this.validate = () => {
        if (!Number.isInteger(Math.sqrt(this.DISTRICT_SIZE))) {
            throw new Error('districts start as squares, district_size must be a perfect square');
        }
        if (!Number.isInteger(Math.sqrt(this.NUM_DISTRICTS))) {
            throw new Error('districts must be able to fit into the grid without remainders');
        }
    };
    this.validate();
}
export default new Parameters();
