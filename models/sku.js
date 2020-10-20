

import {Http} from "../utils/http";
import {Httplocal} from "../utils/httplocal";

class Sku{
    static async getSkusByIds(ids) {
        console.log(ids)
        const res = await Httplocal.request({
            url: `sku?ids=${ids}`
        })
        return res.data
    }
}

export {
    Sku
}