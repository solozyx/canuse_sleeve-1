import {Http} from "./http";

class Paging {
    // 获取更多数据
    constructor(req, count = 10, start = 0) {
        this.req = req;
        this.url = req.url;
        this.count = count;
        this.start = start;
        this.locker = false; // 初始化时无锁
        this.moreData = true; // 是否有更多数据
        this.accumuator = []; // 数据累计
    }

    async getMoreData() {
        // 生成器 generator
        // getLocker
        // request
        // releaseLocker
        if (!this.moreData) {
            return;
        }
        if (!this._getLocker()) {
            return;
        }
        const data = await this._actualGetData();
        this._releaseLocker();
        return data;
    }

    async _actualGetData() {
        const req = this._getCurrentReq();
        const paging = await Http.request(req);
        if (!paging) {
            return null
        }
        if (paging.total === 0) {
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            }
        }
        this.moreData = this._moreData(paging.total_page, paging.page);
        if (this.moreData) {
            this.start += this.count
        }
        this._accumulate(paging.items);
        return {
            empty: false,
            items: paging.items,
            moreData: this.moreData,
            accumulator: this.accumuator
        }
    }

    _moreData(totalPage, pageNum) {
        return pageNum < totalPage - 1 // 后端page从0计数
    }

    _accumulate(items) {
        this.accumuator = this.accumuator.concat(items);
    }

    _getCurrentReq() {
        let url = this.url;
        const params = `start=${this.start}&count=${this.count}`;
        if (url.includes('?')) {
            url += '&' + params
        } else {
            url += '?' + params;
        }
        this.req.url = url;
        return this.req;
    }

    _getLocker() {
        if (this.locker) {
            return false;
        }
        this.locker = true;
        return true;
    }

    _releaseLocker() {
        this.locker = false;
    }
}

export {
    Paging
}
