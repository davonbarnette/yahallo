class InteractionsStoreClass {

    interactionsByParentInteractionId = {};

    getInteraction(parentInteractionId) {
        return this.interactionsByParentInteractionId[parentInteractionId]
    }

    addInteraction(parentInteractionId) {
        this.interactionsByParentInteractionId[parentInteractionId] = {
            status: GRAB_FIGHT_STATUS.IN_PROGRESS,
            users: []
        };
        return this.getInteraction(parentInteractionId);
    }

    changeInteractionStatus(parentInteractionId, status){
        let interaction = this.getInteraction(parentInteractionId);
        if (interaction){
            this.interactionsByParentInteractionId[parentInteractionId] = {
                ...interaction,
                status
            }
        }
    }

    addUserToInteraction(parentInteractionId, discordUserId) {
        let interaction = this.getOrAddInteraction(parentInteractionId);
        let userExists = interaction.users.indexOf(discordUserId) !== -1;
        if (!userExists) {
            this.interactionsByParentInteractionId[parentInteractionId].users.push(discordUserId);
        }
    }

    userIsInInteraction(parentInteractionId, discordUserId){
        let interaction = this.getOrAddInteraction(parentInteractionId);
        return interaction.users.indexOf(discordUserId) !== -1;
    }

    getOrAddInteraction(parentInteractionId) {
        let interaction = this.getInteraction(parentInteractionId);
        if (!interaction) {
            interaction = this.addInteraction(parentInteractionId);
        }
        return interaction;
    }

    getUsersInInteraction(parentInteractionId){
        let interaction = this.getInteraction(parentInteractionId);
        if (interaction){
            return interaction.users;
        } else {
            return undefined;
        }
    }

    removeInteraction(parentInteractionId){
        delete this.interactionsByParentInteractionId[parentInteractionId];
    }

}

let InteractionsStore = new InteractionsStoreClass();
module.exports = InteractionsStore;