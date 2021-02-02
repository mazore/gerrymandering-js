function SwapManager() {
    this.swaps_done = 0;
    // person[n] is originally from district[n]
    this.person1 = null;
    this.person2 = null;
    this.district1 = null;
    this.district2 = null;

    /** Do a swap of two people between their districts. See readme for more information on how this works */
    this.swap = function() {
        while (true) {
            this.getPerson1();
            if (this.getPerson2() != 'restart')
                break
        }

        this.person1.changeDistricts(this.district2);
        this.person2.changeDistricts(this.district1);
        this.swaps_done++;
    }

    /** Gets district1 and person1, using with conditions to make sure no disconnections or harmful swaps occur */
    this.getPerson1 = function() {
        for (this.district1 of shuffled(canvas.districts)) {
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
    }

    /** Gets district2 and person2. If no suitable district2 is found, we raise RestartGettingPeopleError */
    this.getPerson2 = function() {
        for (this.district2 of this.person1.getAdjacentDistricts()) {
            const party2CanBeHelpParty = this.party2CanBeHelpParty();
            // const aDistrictTied = FAVOR_TIE ? this.district1.tied() || this.district2.tied() : null;

            for (this.person2 of shuffled(this.district2.people)) {
                if (!this.person2.getAdjacentDistricts().containsObject(this.district1)) {
                    continue; // If not touching district1
                }
                if (this.person2.adjacentPeople.containsObject(this.person1)) {
                    continue; // Swapping two adjacent people will likely cause disconnection, not always though
                }
                if (!this.person2.getIsRemovable()) {
                    continue; // If removing will cause disconnection in district2
                }
                // if (FAVOR_TIE && aDistrictTied && !this.person1.party.equalTo(this.person2.party)) {
                    // continue; // If swapping will cause a district to become not tied
                // }
                if (!party2CanBeHelpParty && this.person2.party.equalTo(HELP_PARTY)) {
                    return 'restart';  // Better than `continue`
                }
                return;
            }
        }
        return 'restart'
    }

    /** Used in getPerson2, puts people of opposite parties to person1 first*/
    // this.person2Compare = function(p1, p2) {
        // This is definitely not the best way to do this
        // const p1First = p1.party.equalTo(this.person1.party);
        // const p2First = p2.party.equalTo(this.person1.party);
        // if (p1First && !p2First) {
            // return -1;
        // } else if (!p1First && p2First) {
            // return 1;
        // }
        // return 0;
    // }

    /** Returns uf person2 can be HELP_PARTY without having a decrease in HELP_PARTY's total score */
    this.party2CanBeHelpParty = function() {
        if (!this.person1.party.equalTo(HINDER_PARTY))
            return true; // If netAdvantages will stay the same or district2's will increase
        // Now we know that district2 netAdvantage is decreasing by 2 and district1 netAdvantage is increasing by 2
        if (this.district2.netAdvantage == 2) { // If district2 will become tie from HELP_PARTY
            if (this.district1.tied())
                return true; // district1 will become help_party from tie
            else
                return false;
        } else if (0 <= this.district2.netAdvantage && this.district2.netAdvantage <= 1) {
            // If district2 will become HINDER_PARTY from HELP_PARTY/TIE
            if (-2 <= this.district1.netAdvantage && this.district1.netAdvantage <= -1)
                return true; // If district1 will become HELP_PARTY/TIE from HINDER_PARTY
            else
                return false;
        }
        return true;
    }
}
