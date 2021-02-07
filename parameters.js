function defineParameters() {
    SIMULATION_WIDTH = 480; // Width and height of simulation in pixels
    DISTRICT_SIZE = 16; // Number of people per district
    GRID_WIDTH = 24; // Width and height of grid of people
    HELP_PARTY = BLUE; // Party to help in the gerrymandering process
    FAVOR_TIE = false; // Whether or not to try to make more tied districts
    PERCENT_BLUE = 50; // What percent of people vote blue
    SHOW_MARGINS = false; // Whether or not to change saturation of district colors based on how much it's won by

    HINDER_PARTY = HELP_PARTY.equalTo(RED) ? BLUE : RED; // Party to hinder in the gerrymandering process
    NUM_PEOPLE = GRID_WIDTH ** 2 // Number of people
    NUM_DISTRICTS = NUM_PEOPLE / DISTRICT_SIZE; // Number of districts
    STANCE_THRESHOLD = Math.floor(NUM_PEOPLE*PERCENT_BLUE/100 - 0.5) // Where to divide people's stances
    SQUARE_WIDTH = SIMULATION_WIDTH / GRID_WIDTH; // Width of a person square

    if (!Number.isInteger(Math.sqrt(DISTRICT_SIZE))) {
        throw 'districts start as squares, district_size must be a perfect square';
    }
    if (!Number.isInteger(Math.sqrt(NUM_DISTRICTS))) {
        throw 'districts must be able to fit into the grid without remainders';
    }
}
