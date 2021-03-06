/** Manages the swapping of two people between districts. See readme for more information */
import {
    containsObject, increment, normalize, shuffled, weightedChoice,
} from '../helpers/functions.js';
import ps from '../parameters.js';
import { TIE } from '../parties.js';

export default function SwapManager(simulation) {
    this.swapsDone = 0;
    // person[n] is originally from district[n]
    this.person1 = null;
    this.person2 = null;
    this.district1 = null;
    this.district2 = null;

    /** Do a swap of two people between their districts. See readme for how this works */
    this.swap = () => {
        for (;;) {
            this.getPerson1();
            if (this.getPerson2() !== 'restart') break;
        }

        this.updateScore();

        this.person1.changeDistricts(this.district2);
        this.person2.changeDistricts(this.district1);
        this.swapsDone += 1;
    };

    /**
     * Gets district1 and person1, using with conditions to make sure no disconnections or harmful
     * swaps occur
     */
    this.getPerson1 = () => {
        for (this.district1 of this.district1Generator()) {
            const idealParty1 = this.district1.idealGiveAway();

            for (this.person1 of shuffled(this.district1.people)) {
                if (idealParty1 != null && !this.person1.party.equalTo(idealParty1)) {
                    continue; // If is not the ideal party to give away for district1
                }
                if (!this.person1.getIsRemovable()) {
                    continue; // If removing will cause disconnection in district1
                }
                return;
            }
        }
    };

    /** Gets district2 and person2. If no suitable district2 is found, we return 'restart' */
    this.getPerson2 = () => {
        for (this.district2 of shuffled(this.person1.getAdjacentDistricts())) {
            const party2CanBeHelpParty = this.party2CanBeHelpParty();
            let aDistrictTied;
            if (ps.FAVOR_TIE) {
                aDistrictTied = this.district1.tied() || this.district2.tied();
            }

            for (this.person2 of this.getPerson2Choices()) {
                if (!containsObject(this.person2.getAdjacentDistricts(), this.district1)) {
                    continue; // If not touching district1
                }
                if (containsObject(this.person2.adjacentPeople, this.person1)) {
                    continue; // Swapping two adjacent people will likely cause disconnection
                }
                if (!this.person2.getIsRemovable()) {
                    continue; // If removing will cause disconnection in district2
                }
                const partiesEqual = this.person1.party.equalTo(this.person2.party);
                if (ps.FAVOR_TIE && aDistrictTied && !partiesEqual) {
                    continue; // If swapping will cause a district to become not tied
                }
                if (!party2CanBeHelpParty && this.person2.party.equalTo(ps.HELP_PARTY)) {
                    return 'restart'; // Better than `continue` not sure why
                }
                return 'completed';
            }
        }
        return 'restart';
    };

    /** Used in getPerson2, yields people of opposite parties to person1 first */
    this.getPerson2Choices = function* () {
        const notYielded = [];
        for (const person of this.district2.people) {
            if (!person.party.equalTo(this.person1.party)) {
                yield person;
            } else {
                notYielded.push(person);
            }
        }
        for (const person of notYielded) {
            yield person;
        }
    };

    /** Yields district1 choices weighted using getDistrict1Weight */
    this.district1Generator = function* () {
        const districtWeightMap = new Map();
        for (const district of simulation.districts) {
            districtWeightMap.set(district, district.getDistrict1Weight());
        }
        while (true) {
            const choice = weightedChoice([...districtWeightMap.entries()]);
            yield choice;
            districtWeightMap.delete(choice);
        }
    };

    /** Returns if person2 can be HELP_PARTY without decreasing HELP_PARTY's total score */
    this.party2CanBeHelpParty = () => {
        if (!this.person1.party.equalTo(ps.HINDER_PARTY)) {
            return true; // If netAdvantages will stay the same or district2's will increase
        }
        // Now we know that district2 netAdvantage is decreasing by 2 and district1 netAdvantage
        // is increasing by 2
        if (this.district2.netAdvantage === 2) { // If district2 will become tie from HELP_PARTY
            if (this.district1.tied()) {
                return true; // district1 will become HELP_PARTY from tie
            }
            return false;
        }
        if (0 <= this.district2.netAdvantage && this.district2.netAdvantage <= 1) {
            // If district2 will become HINDER_PARTY from HELP_PARTY/TIE
            if (-2 <= this.district1.netAdvantage && this.district1.netAdvantage <= -1) {
                return true; // If district1 will become HELP_PARTY/TIE from HINDER_PARTY
            }
            return false;
        }
        return true;
    };

    /**
     * Called right before swapping, after people and districts are picked. Updates `simulation`s
     * `score` map depending on if districts are flipping parties.
     * */
    this.updateScore = () => {
        const swapInfo1 = this.getSwapInfo(this.district1, this.person1.party, this.person2.party);
        const swapInfo2 = this.getSwapInfo(this.district2, this.person2.party, this.person1.party);

        if (swapInfo1.winnerChange + swapInfo2.winnerChange === 0) {
            // If no score change, and use + because they can cancel out which wouldn't change score
            return;
        }
        // Score will change
        // Now we know that only one winner change is non-zero because they don't cancel
        const changedSwapInfo = swapInfo1.winnerChange !== 0 ? swapInfo1 : swapInfo2;
        increment(simulation.score, changedSwapInfo.partyToLosePoint, -1);
        increment(simulation.score, changedSwapInfo.partyToGainPoint, 1);
    };

    /**
     * Returns info about what `district` will be like after the swap. Result object contains
     * `newNetAdvantage` - netAdvantage of `district` after the swap, `winnerChange` - non zero if
     * the winner of `district` changes, if `winnerChange` isn't zero, `partyToGainPoint` and
     * `partyToLosePoint` are parties that will gain and lose points respectively.
     */
    this.getSwapInfo = (district, giveParty, getParty) => {
        const result = {};

        result.newNetAdvantage = district.netAdvantage;
        result.newNetAdvantage -= giveParty.netAdvantage(ps);
        result.newNetAdvantage += getParty.netAdvantage(ps);

        result.winnerChange = normalize(district.netAdvantage) - normalize(result.newNetAdvantage);

        if (result.winnerChange !== 0) { // If the winner will change
            result.partyToLosePoint = district.getWinner();
            if (result.newNetAdvantage > 0) {
                result.partyToGainPoint = ps.HELP_PARTY;
            } else if (result.newNetAdvantage < 0) {
                result.partyToGainPoint = ps.HINDER_PARTY;
            } else {
                result.partyToGainPoint = TIE;
            }
        }

        return result;
    };
}
