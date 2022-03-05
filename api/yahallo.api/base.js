const axios = require("axios")

class YahalloApi {

    axiosInstance = axios.create({
        baseURL: "http://localhost:1337/api"
    })

    constructor() {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${process.env.YAHALLO_API_TOKEN}`;
    }

}

module.exports = YahalloApi;