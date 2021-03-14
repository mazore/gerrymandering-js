/**
 * Represents one person, who gets one vote for one party. District lines are drawn around these
 * people
 */
import { rect } from '../helpers/drawing.js';
import { count, group, increment } from '../helpers/functions.js';
import ps from '../parameters.js';
import { BLUE, RED } from '../parties.js';

export default function Person(simulation, id, gridX, gridY, stance) {
    this.id = id;
    [this.gridX, this.gridY] = [gridX, gridY];
    [this.x, this.y] = [gridX * ps.SQUARE_WIDTH, gridY * ps.SQUARE_WIDTH]; // In pixel coordinates
    this.stance = stance; // The placement of this person on the political spectrum
    this.district = null; // Defined in District

    this.atWest = this.gridX === 0;
    this.atNorth = this.gridY === 0;
    this.atEast = this.gridX === ps.GRID_WIDTH - 1;
    this.atSouth = this.gridY === ps.GRID_WIDTH - 1;

    /** Called after all people and districts are initialized */
    this.secondaryInit = () => {
        if (!this.atWest) this.personWest = simulation.peopleGrid[this.gridY][this.gridX - 1];
        if (!this.atNorth) this.personNorth = simulation.peopleGrid[this.gridY - 1][this.gridX];
        if (!this.atEast) this.personEast = simulation.peopleGrid[this.gridY][this.gridX + 1];
        if (!this.atSouth) this.personSouth = simulation.peopleGrid[this.gridY + 1][this.gridX];

        if (!this.atNorth && !this.atEast) { // Northeast
            this.personNE = simulation.peopleGrid[this.gridY - 1][this.gridX + 1];
        }
        if (!this.atSouth && !this.atEast) { // Southeast
            this.personSE = simulation.peopleGrid[this.gridY + 1][this.gridX + 1];
        }
        if (!this.atSouth && !this.atWest) { // Southwest
            this.personSW = simulation.peopleGrid[this.gridY + 1][this.gridX - 1];
        }
        if (!this.atNorth && !this.atWest) { // Northwest
            this.personNW = simulation.peopleGrid[this.gridY - 1][this.gridX - 1];
        }

        /** adjacentPeople - up to 4 people in direct cardinal directions */
        this.adjacentPeople = [
            this.personWest, this.personNorth,
            this.personEast, this.personSouth].filter((item) => item != null);
        /**
         * surroundingPeople - always length 8, includes all people in surrounding 8 squares,
         * undefined if no person
         */
        this.surroundingPeople = [
            this.personNorth, this.personNE, this.personEast, this.personSE,
            this.personSouth, this.personSW, this.personWest, this.personNW];

        this.setParty();
    };

    this.draw = () => {
        const radius = ps.SQUARE_WIDTH * 0.175;
        const offset = ps.SQUARE_WIDTH / 2 - radius;
        const w = radius * 2;
        rect(simulation.ctx, this.x + offset, this.y + offset, w, w, this.party.color1);
    };

    this.setParty = () => {
        const before = this.party;
        this.party = this.stance < ps.STANCE_THRESHOLD ? RED : BLUE;
        if (typeof before === 'undefined') { // For initialization
            this.district.netAdvantage += this.party.netAdvantage(ps);
            increment(simulation.demographics, this.party);
            return;
        }
        if (!this.party.equalTo(before)) {
            this.district.netAdvantage -= before.netAdvantage(ps);
            this.district.netAdvantage += this.party.netAdvantage(ps);
            increment(simulation.demographics, before, -1);
            increment(simulation.demographics, this.party);
        }
    };

    /** Returns a list of districts neighboring this person, excluding the district this is in */
    this.getAdjacentDistricts = () => {
        const result = [];
        for (const person of this.adjacentPeople) {
            if (this.district.id !== person.district.id) {
                result.push(person.district);
            }
        }
        return result;
    };

    this.getEdges = () => {
        // Edge are in format 'gridX,gridY,dir'. Remember dir can only be 'n' or 'w'
        const edges = [
            this.atWest ? null : `${gridX},${gridY},w`,
            this.atNorth ? null : `${gridX},${gridY},n`,
            this.atEast ? null : `${gridX + 1},${gridY},w`,
            this.atSouth ? null : `${gridX},${gridY + 1},n`,
        ];
        return edges.filter((edge) => edge != null);
    };

    /**
     * Returns whether the person can be removed from their district without disconnecting district
     *
     * Method: get a boolean list of whether each of the surrounding 8 people are in our district.
     * If there are more than 2 'streaks' of True's (including carrying over between start and end
     * of the list), then removing the square will cause a disconnected group because the
     * surrounding squares are not connected to each other. This works on the assumption that there
     * are no holes, which there aren't because all districts are the same size, and there are no
     * people without a district.
     */
    this.getIsRemovable = () => {
        const boolList = [];
        for (const person of this.surroundingPeople) {
            if (typeof person === 'undefined') {
                boolList.push(false);
                continue;
            }
            boolList.push(this.district.id === person.district.id);
        }
        const numTrues = count(boolList, true);
        for (const arr of group(boolList.concat(boolList))) {
            if (arr[0] && arr.length >= numTrues) {
                return true;
            }
        }
        return false;
    };

    /** Change which district this person belongs to, does not change location or party */
    this.changeDistricts = (destination) => {
        this.district.people.splice(this.district.people.indexOf(this), 1);
        this.district.netAdvantage -= this.party.netAdvantage(ps);
        destination.people.push(this);
        destination.netAdvantage += this.party.netAdvantage(ps);
        this.district = destination;
    };
}
