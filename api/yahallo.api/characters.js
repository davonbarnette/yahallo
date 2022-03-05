const YahalloApi = require("./base");
const Logger = require("../../logger");

class CharactersApiSingleton extends YahalloApi {

    async dropCards(){
        try {
            let res = await this.axiosInstance.post("/cards/drop");
            return res.data;
        } catch (e) {
            Logger.error("Could not drop cards", e.message);
            return undefined;
        }
    }

}

const CharactersApi = new CharactersApiSingleton();

module.exports = CharactersApi;