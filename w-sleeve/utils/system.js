import {promisic} from "./util";
import {px2rpx} from "../miniprogram_npm/lin-ui/utils/util";

const getSystemSize = async function () {
    const res = await promisic(wx.getSystemInfo)()
    return {
        windowHeight: res.windowHeight,
        windowWidth: res.windowHeight,
        screenHeight: res.screenHeight,
        screenWidth: res.screenWidth
    }
}

const getWindowHeightRpx = async function () {
    const res = await getSystemSize()
    const h = px2rpx(res.windowHeight)
    return h
}

export {getSystemSize, getWindowHeightRpx}