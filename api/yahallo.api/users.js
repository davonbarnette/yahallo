const YahalloApi = require("./base");
const Logger = require("../../logger");
const qs = require("qs");

class UsersApiSingleton extends YahalloApi {

    async getDiscordUser(rawQuery) {
        let query = qs.stringify(rawQuery)
        try {
            let res = await this.axiosInstance.get(`/discord-users?${query}`);
            return res.data.data;
        } catch (e) {
            Logger.error("Could not get user", e.message);
            return undefined;
        }
    }

    async createDiscordUser(discordUserId) {
        try {
            let res = await this.axiosInstance.post("/discord-users", {
                data: {
                    discordUserId
                }
            })
            return res.data.data;
        } catch (e) {
            Logger.error("Could not create user", e.message);
            return undefined;
        }
    }

    async getOrCreateUser(messageAuthorId) {
        let strapiDiscordUserSearch = await UsersApi.getDiscordUser({
            filters: {
                discordUserId: {
                    $eq: messageAuthorId
                }
            }
        });
        let strapiDiscordUser;
        if (!strapiDiscordUserSearch || strapiDiscordUserSearch.length === 0) {
            strapiDiscordUser = await UsersApi.createDiscordUser(messageAuthorId);
        } else {
            strapiDiscordUser = strapiDiscordUserSearch[0]
        }
        return strapiDiscordUser;
    }

}

const UsersApi = new UsersApiSingleton();

module.exports = UsersApi;