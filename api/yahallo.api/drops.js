const qs = require("qs");
const YahalloApi = require("./base");
const Logger = require("../../logger");

class DropsApiSingleton extends YahalloApi {

    async createDrop(data){
        try {
            let res = await this.axiosInstance.post("/drops", { data });
            return res.data;
        } catch (e) {
            Logger.error("Could not create drop", e.message);
            return undefined;
        }
    }
    async getDrops(rawQuery){
        let query = qs.stringify(rawQuery)
        try {
            let res = await this.axiosInstance.get(`/drops?${query}`);
            return res.data.data;
        } catch (e) {
            Logger.error("Could not create drop", e.message);
            return undefined;
        }
    }
}

const DropsApi = new DropsApiSingleton();

module.exports = DropsApi;