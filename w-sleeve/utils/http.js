import {config} from "../config/config";
import {promisic} from "./util";


class Http {
    static async request({url, data, callback, method='GET'}) {
         const res = await promisic(wx.request)({
             url: `${config.apiBaseUrl}${url}`,
             data,
             method,
             header: {
                 appkey: config.appkey
             },
             success(res) {
                 callback(res.data)
             }
         })
        return res.data
    }
}

export {Http}