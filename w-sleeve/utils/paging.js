import boolean from "../miniprogram_npm/lin-ui/common/async-validator/validator/boolean";
import {Http} from "./http";

class Paging {

    start
    count
    req
    locker
    url
    hasMoreData
    accumulator

    constructor(req, count=10,start=0) {
        this.req = req
        this.url = req.url
        this.count = count
        this.start = start
        this.hasMoreData = true
        this.locker = false
        this.accumulator = []
    }

    async getMoreData() {
        if (!this.hasMoreData) {
            return
        }
        if (!this._getLocker()) {
            return
        }
        const data = await this._actualGetData()
        this._releaseLocker()
        return data
    }

    async _actualGetData() {
        const req = this._getCurrentReq()
        let paging = await Http.request(req)
        if (!paging) {
            return null
        }
        if (paging.total === 0) {
            return {
                empty: true
            }
        }
        this.hasMoreData = Paging._moreData(paging.total_page, paging.page)
        if (this.hasMoreData) {
            this.start += this.count
        }
        this._accumulate(paging.items)
        return {
            empty: false,
            items: paging.items,
            moreData: this.hasMoreData,
            accumulator: this.accumulator
        }
    }

    _accumulate(items) {
        this.accumulator = this.accumulator.concat(items)
    }

    static _moreData(totalPage, pageNum) {
        return pageNum < totalPage-1
    }

    _getCurrentReq() {
        let url = this.url
        const params = `start=${this.start}&count=${this.count}`
        if(url.includes("?")) {
            url += '&' + params
        } else {
            url += '?' + params
        }
        this.req.url = url
        return this.req
    }

    _getLocker() {
        if (this.locker) {
            return false
        }
        this.locker = true
        return true
    }

    _releaseLocker() {
        this.locker = false
    }
}

export {Paging}