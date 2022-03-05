const {GrabFight} = require("../classes/grab.fight");


class GrabFightsStoreClass {

    grabFightsByPrintId = {};

    getGrabFight(printId) {
        return this.grabFightsByPrintId[printId]
    }

    addGrabFight(printId, timeoutFn, timeToExpire = 5) {
        this.grabFightsByPrintId[printId] = new GrabFight(printId, timeoutFn, timeToExpire);
        return this.getGrabFight(printId);
    }

    changeGrabFightStatus(printId, status){
        let grabFight = this.getGrabFight(printId);
        if (grabFight){
            this.grabFightsByPrintId[printId] = {
                ...grabFight,
                status
            }
        }
    }

    addUserToGrabFight(printId, discordUserId) {
        let grabFight = this.getOrAddGrabFight(printId);
        let userExists = grabFight.users.indexOf(discordUserId) !== -1;
        if (!userExists) {
            this.grabFightsByPrintId[printId].users.push(discordUserId);
        }
    }

    userIsInGrabFight(printId, discordUserId){
        let grabFight = this.getOrAddGrabFight(printId);
        return grabFight.users.indexOf(discordUserId) !== -1;
    }

    getOrAddGrabFight(printId) {
        let grabFight = this.getGrabFight(printId);
        if (!grabFight) {
            grabFight = this.addGrabFight(printId);
        }
        return grabFight;
    }

    getUsersInGrabFight(printId){
        let grabFight = this.getGrabFight(printId);
        if (grabFight){
            return grabFight.users;
        } else {
            return undefined;
        }
    }

    removeGrabFight(printId){
        delete this.grabFightsByPrintId[printId];
    }
}

const GrabFightsStore = new GrabFightsStoreClass();
module.exports = {GrabFightsStore};