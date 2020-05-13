
import {Http} from "../utils/http";
import {Httplocal} from "../utils/httplocal";


class User{

    static async updateUserInfo(data) {
        return Httplocal.request({
            url:`user/wx_info`,
            data,
            method:'POST'
        })
    }
}

export {
    User
}