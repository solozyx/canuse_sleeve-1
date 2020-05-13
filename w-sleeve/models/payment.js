
import {Http} from "../utils/http";
import {Httplocal} from "../utils/httplocal";

class Payment{

    static async getPayParams(orderId) {
        const serverParams = await Httplocal.request({
            url:`payment/pay/order/${orderId}`,
            method:'POST'
        })
        return  serverParams
    }



}

export {
    Payment
}