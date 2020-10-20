import {Http} from "../utils/http";
import {Httplocal} from "../utils/httplocal";

class Activity {

    static locationD = 'a-2'

    static async getHomeLocationD() {
        return await Http.request({
            url: `activity/name/${Activity.locationD}`
        })
    }

    static async getActivityWithCoupon(activityName) {
        return Httplocal.request({
            url: `activity/name/${activityName}/with_coupon`
        })
    }

}

export {Activity}