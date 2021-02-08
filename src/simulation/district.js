/**
 * Represents a collection of people, with a line drawn around them. The winner is determined by
 * which party has the most people contained in this district
 */
import { line, rect } from '../helpers/drawing.js';
import { lighten, increment } from '../helpers/functions.js';
import ps from '../parameters.js';
import { TIE } from '../parties.js';

export default function District(simulation, id, gridX1, gridY1, gridX2, gridY2) {
    this.id = id;
    // gridX1 etc. bound the district square in grid coords
    this.gridX1 = gridX1;
    this.gridY1 = gridY1;
    this.gridX2 = gridX2;
    this.gridY2 = gridY2;
    this.netAdvantage = 0; // num HELP_PARTY people minus num HINDER_PARTY people

    this.people = []; // Array of people contained
    for (let gridY = gridY1; gridY < gridY2; gridY += 1) {
        for (let gridX = gridX1; gridX < gridX2; gridX += 1) {
            const person = simulation.peopleGrid[gridY][gridX];

            this.people.push(person);
            person.district = this;
        }
    }

    this.draw = () => {
        // Translucent fill
        let color = this.getWinner().color2;
        if (ps.SHOW_MARGINS) {
            const factor = (Math.abs(this.netAdvantage) / ps.DISTRICT_SIZE) * 1.5;
            color = lighten(color, 0.75 - factor);
        }
        for (const person of this.people) {
            rect(simulation.ctx, person.x, person.y, ps.SQUARE_WIDTH, ps.SQUARE_WIDTH, color);
        }

        // Outline
        /**
         * Edges that outline the district (the ones to draw) will only be edges of one person in
         * the district. We add up all the edges (in form 'gridX,gridY,dir') and the ones with 1
         * occurrence we draw.
         */
        const edgeOccurrenceMap = new Map();
        for (const person of this.people) {
            for (const edge of person.getEdges()) {
                increment(edgeOccurrenceMap, edge);
            }
        }
        // Draw outline
        for (const [edge, occurrence] of edgeOccurrenceMap) {
            if (occurrence === 1) {
                const [gridX, gridY, dir] = edge.split(',');
                const [x, y] = [gridX * ps.SQUARE_WIDTH, gridY * ps.SQUARE_WIDTH];
                if (dir === 'n') {
                    line(simulation.ctx, x, y, x + ps.SQUARE_WIDTH, y, '#000', 3);
                } else if (dir === 'w') {
                    line(simulation.ctx, x, y, x, y + ps.SQUARE_WIDTH, '#000', 3);
                }
            }
        }
    };

    this.getWinner = () => {
        if (this.tied) {
            return TIE;
        }
        return this.netAdvantage > 0 ? ps.HELP_PARTY : ps.HINDER_PARTY;
    };

    Object.defineProperties(this, {
        tied: { get() { return this.netAdvantage === 0; } },
    });

    /** Returns which party this district prioritizes swapping to another district (giving away) */
    this.idealGiveAway = () => {
        if (ps.FAVOR_TIE) {
            if (this.tied) {
                return null;
            }
            return this.getWinner();
        }
        if (-4 <= this.netAdvantage && this.netAdvantage <= 2) {
            return ps.HINDER_PARTY; // If flippable/at risk, try to get more HELP_PARTY people
        }
        return ps.HELP_PARTY; // If not flippable or safe HELP_PARTY, share our HELP_PARTY people
    };

    /**
     * Returns the weight to use for this district when picking a randomized district1. Values were
     * determined by a black box optimization method
     */
    this.getDistrict1Weight = () => {
        if (0 < this.netAdvantage && this.netAdvantage <= 2) { // If at risk
            return 1;
        }
        if (this.tied) {
            return 11;
        }
        if (-4 <= this.netAdvantage && this.netAdvantage <= 0) { // If flippable
            return 4.35442295;
        }
        if (this.netAdvantage > 2) { // If safe to help_party
            return 2.47490108;
        }
        return 2.06497273; // If safe not flippable/safe for hinder_party
    };
}
