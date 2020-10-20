import {Http} from "../utils/http";

class Spu {

    static isNoSpec(spu) {
        return (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0)
    }

    static async getDetail(id) {
        return await Http.request({
            url: `spu/id/${id}/detail`
        })
    }
}

export {Spu}