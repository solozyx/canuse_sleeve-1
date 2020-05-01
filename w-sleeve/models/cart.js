import {accAdd, accMultiply} from "../utils/number";
import {Sku} from "./sku";

class Cart {

    static SKU_MIN_COUNT = 1
    static SKU_MAX_COUNT = 77
    static CART_ITEM_MAX_COUNT = 77
    static STORAGE_KEY = 'cart'

    _cartData = null
    checkedPrice = 0
    checkedCount = 0

    constructor() {
        if (typeof Cart.instance === "object") {
            return Cart.instance
        }
        Cart.instance = this
        return this
    }

    static isSoldOut(item) {
        return item.sku.stock === 0
    }

    static isOnline(item) {
        return item.sku.online
    }

    getAllCartItemFromLocal() {
        return this._getCartData()
    }

    async getAllSkuFromServer() {
        const cartData = this._getCartData();
        if (cartData.items.length === 0) {
            return null
        }
        const skuIds = this.getSkuIds()
        const serverData = await Sku.getSkusByIds(skuIds)
        this._refreshByServerData(serverData)
        this._calCheckedPrice()
        this._refreshStorage()
        return this._getCartData()
    }

    getCartItemCount() {
        return this._getCartData().items.length
    }

    getSkuIds() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return []
        }
        return cartData.items.map(item => item.skuId)
    }

    _refreshByServerData(serverData) {
        const cartData = this._getCartData()
        cartData.items.forEach(item=>{
            this._setLatestCartItem(item, serverData)
        })
    }

    _setLatestCartItem(item, serverData) {
        let removed = true
        for (let sku of serverData) {
            if (item.skuId === sku.id) {
                removed = false
                item.sku = sku
                break
            }
        }
        if(removed){
            item.sku.online = false
        }
    }

    addItem(newItem) {
        if (this._beyondMaxCartItemCount()) {
            throw new Error('超过购物车最大数量限制')
        }
        this._pushItem(newItem)
        this._calCheckedPrice()
        this._refreshStorage()
    }

    removeItem(skuId) {
        const oldItemIndex = this._findEqualItemIndex(skuId)
        const cartData = this._getCartData()
        cartData.items.splice(oldItemIndex, 1)
        this._calCheckedPrice()
        this._refreshStorage()
    }

    isAllChecked() {
        let allChecked = true
        const cartItems = this._getCartData().items
        for (let item of cartItems) {
            if (!item.checked) {
                allChecked = false
                break
            }
        }
        return allChecked
    }

    checkAll(checked) {
        const cartData = this._getCartData()
        cartData.items.forEach(item => {
            item.checked = checked
        })
        this._calCheckedPrice()
        this._refreshStorage()
    }

    _calCheckedPrice() {
        const cartItems = this.getCheckedItems()
        if (cartItems.length == 0) {
           this.checkedPrice = 0
           this.checkedCount = 0
           return
        }
        this.checkedPrice = 0
        this.checkedCount = 0
        let partTotalPrice = 0
        for (let cartItem of cartItems) {
            if (cartItem.sku.discount_price) {
                partTotalPrice = accMultiply(cartItem.count, cartItem.sku.discount_price)
            } else {
                partTotalPrice = accMultiply(cartItem.count, cartItem.sku.price)
            }
            this.checkedPrice = accAdd(this.checkedPrice, partTotalPrice)
            this.checkedCount += cartItem.count
        }
    }

    getCheckedItems() {
        const cartItems = this._getCartData().items
        const checkedCartItems = []
        cartItems.forEach(item=>{
            if(item.checked){
                checkedCartItems.push(item)
            }
        })
        return checkedCartItems
    }

    checkItem(skuId) {
        const oldItem = this._findEqualItem(skuId)
        oldItem.checked = !oldItem.checked
        this._calCheckedPrice()
        this._refreshStorage()
    }

    replaceItemCount(skuId, newCount) {
        const oldItem = this._findEqualItem(skuId)
        if (!oldItem) {
            console.error('异常情况，更新CartItem中的数量不应当找不到相应数据')
            return
        }
        if (newCount < 1) {
            console.error('异常情况，CartItem的Count不可能小于1')
            return
        }
        oldItem.count = newCount
        if (oldItem.count >= Cart.SKU_MAX_COUNT) {
            oldItem.count = Cart.SKU_MAX_COUNT
        }
        this._calCheckedPrice()
        this._refreshStorage()
    }


    isEmpty() {
        const cartData = this._getCartData()
        return cartData.items.length === 0;
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
        let cartData = wx.getStorageSync(Cart.STORAGE_KEY)
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
        return cartData.items.length >= Cart.CART_ITEM_MAX_COUNT
    }

}

export {Cart}