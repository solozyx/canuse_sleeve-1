
class Cart {

    static SKU_MIN_COUNT = 1
    static SKU_MAX_COUNT = 77
    static CART_ITEM_MAX_COUNT = 77
    static STORAGE_KEY = 'cart'

    _cartData = []

    constructor() {
        if (typeof Cart.instance === "object") {
            return Cart.instance
        }
        Cart.instance = this
        return this
    }

    addItem(newItem) {
        if (this._beyondMaxCartItemCount()) {
            throw new Error('超过购物车最大数量限制')
        }
        this._pushItem(newItem)
        this._refreshStorage()
    }

    removeItem(skuId) {
        const oldItemIndex = this._findEqualItemIndex(skuId)
        const cartData = this._getCartData()
        cartData.items.splice(oldItemIndex, 1)
        this._refreshStorage()
    }

    _findEqualItemIndex(skuId) {
        const cartData = this._getCartData()
        return cartData.items.findIndex(item => {
            return item.skuId === skuId
        })
    }

    _pushItem(newItem) {
        const cartData = this._getCartData()
        const oldItem = this._findEqualItem(newItem.skuId)
        if (!oldItem) {
            cartData.items.unshift(newItem)
        } else {
            this._combineItem(oldItem, newItem)
        }
    }

    _findEqualItem(newSkuId) {
        const cartData = this._getCartData()
        const olditems = cartData.items.filter(item => item.skuId == newSkuId)
        return olditems.length == 0 ? null : olditems[0]
    }

    _refreshStorage() {
        wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
    }

    _combineItem(oldItem, newItem) {
        this._plusCount(oldItem, newItem.count)
    }

    _plusCount(item, count) {
        item.count += count
        if (item.count >= Cart.SKU_MAX_COUNT) {
            item.count = Cart.SKU_MAX_COUNT
        }
    }

    _getCartData() {
        if (this._cartData !== null) {
            return this._cartData
        }
        let cartData = wx.getStorageInfoSync(Cart.STORAGE_KEY)
        if (!cartData) {
            cartData = this._initCartDataStorage()
        }
        this._cartData = cartData
        return cartData
    }

    _initCartDataStorage() {
        const cartData = {
            items: []
        }
        wx.setStorageSync(Cart.STORAGE_KEY, cartData)
        return cartData
    }

    _beyondMaxCartItemCount() {
        const cartData = this._getCartData()
        return cartData.item.length >= Cart.CART_ITEM_MAX_COUNT
    }

}

export {Cart}