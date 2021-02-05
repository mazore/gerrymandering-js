function defineParameters() {
    SIMULATION_WIDTH = 480; // Width and height of simulation in pixels
    DISTRICT_SIZE = 16; // Number of people per district
    HELP_PARTY = BLUE; // Party to help in the gerrymandering process
    FAVOR_TIE = false; // Whether or not to try to make more tied districts
    GRID_WIDTH = 24; // Width and height of grid of people

    HINDER_PARTY = HELP_PARTY.equalTo(RED) ? BLUE : RED; // Party to hinder in the gerrymandering process
    NUM_DISTRICTS = (GRID_WIDTH ** 2) / DISTRICT_SIZE; // Number of districts
    SQUARE_WIDTH = SIMULATION_WIDTH / GRID_WIDTH; // Width of a person square

    if (!Number.isInteger(Math.sqrt(DISTRICT_SIZE))) {
        throw 'districts start as squares, district_size must be a perfect square';
    }
    if (!Number.isInteger(Math.sqrt(NUM_DISTRICTS))) {
        throw 'districts must be able to fit into the grid without remainders';
    }
}
