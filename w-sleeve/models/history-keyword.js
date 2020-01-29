
class HistoryKeyword {

    static MAX_ITEM_COUNT = 20
    static KEY = 'history-keyword'

    keywords = []

    constructor() {
        if (typeof HistoryKeyword.instance === 'object') {
            return HistoryKeyword.instance
        }
        HistoryKeyword.instance = this
        this.keywords = this._getLocalKeywords()
        return this
    }

    save(keyword) {
        const items = this.keywords.filter(k=>{
            return k === keyword
        })
        if (items.length !== 0) {
            return
        }
        if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
           this.keywords.pop()
        }
        this.keywords.unshift(keyword)
        this._refreshLocal()
    }

    get() {
        const keywords = this._getLocalKeywords()
        return keywords
    }

    clear() {
        this.keywords = []
        this._refreshLocal()
    }

    _refreshLocal() {
        wx.setStorageSync(HistoryKeyword.KEY,this.keywords)
    }

    _getLocalKeywords() {
        const keywords = wx.getStorageSync(HistoryKeyword.KEY)
        if (!keywords) {
            wx.setStorageSync(HistoryKeyword.KEY,[])
            return []
        }
        return keywords
    }
}

export {HistoryKeyword}