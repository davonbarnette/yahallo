const YahalloApi = require("./base");
const Logger = require("../../logger");
const qs = require("qs");

class PrintsApiSingleton extends YahalloApi {

    async createPrints() {
        try {
            let res = await this.axiosInstance.post("/prints");
            return res.data;
        } catch (e) {
            Logger.error("Could not create prints", e);
            return undefined;
        }
    }

    async getPrints(rawQuery) {
        let query = qs.stringify(rawQuery)
        try {
            let res = await this.axiosInstance.get(`/prints?${query}`);
            return res.data;
        } catch (e) {
            Logger.error("Could not get prints", e);
            return undefined;
        }
    }

    async getPrint(printId, rawQuery) {
        let query = qs.stringify(rawQuery)
        try {
            let res = await this.axiosInstance.get(`/prints/${printId}?${query}`);
            return res.data;
        } catch (e) {
            Logger.error("Could not create prints", e);
            return undefined;
        }
    }

    async updatePrint(printId, data) {
        let query = qs.stringify({
            populate: {
                card: {
                    populate: {
                        character: "*",
                        image: "*"
                    }
                }
            }
        })
        try {
            let res = await this.axiosInstance.put(`/prints/${printId}?${query}`, {data});
            return res.data;
        } catch (e) {
            Logger.error("Could not create prints", e);
            return undefined;
        }
    }

    async getPrintImage(imageUrl) {
        try {
            let res = await this.axiosInstance.get(imageUrl, {responseType: 'arraybuffer'});
            return res.data;
        } catch (e) {
            Logger.error("Could not get image", e);
            return undefined;
        }
    }

}

const PrintsApi = new PrintsApiSingleton();

module.exports = PrintsApi;