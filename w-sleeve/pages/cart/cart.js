// pages/cart/cart.js
import {Cart} from "../../models/cart";
import {Calculator} from "../../models/calculator";

const cart = new Cart()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems:[],
    isEmpty: false,
    allChecked: false,
    totalPrice: 0,
    totalSkuCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await cart.getAllSkuFromServer()
    //
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const cartItems = cart.getAllCartItemFromLocal().items
    if (cart.isEmpty()) {
      this.empty()
      return
    }
    this.setData({
      cartItems: cartItems
    })
    cart._calCheckedPrice()
    this.notEmpty()
    this.isAllChecked()
    this.refreshCartData()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  onDeleteItem(event) {
    this.isAllChecked()
    this.refreshCartData()
  },

  onCountFloat(event) {
    this.refreshCartData()
  },

  onSingleCheck(event) {
    this.isAllChecked()
    this.refreshCartData()
  },

  isAllChecked() {
    const allChecked = cart.isAllChecked()
    console.log(allChecked)
    this.setData({
      allChecked
    })
  },

  refreshCartData() {
    this.setData({
      totalPrice: cart.checkedPrice,
      totalSkuCount: cart.checkedCount
    })
  },

  empty() {
    this.setData({
      isEmpty: true,
    })
    wx.hideTabBarRedDot({
      index: 2
    })
  },

  notEmpty() {
    this.setData({
      isEmpty: false
    })
    wx.showTabBarRedDot({
      index: 2
    })
  },

  onSettle() {
    if (this.data.totalSkuCount <= 0) {
      return
    }
    wx.navigateTo({
      url: 'pages/order/order'
    })
  },

  onCheckAll(event) {
    const checked = event.detail.checked
    cart.checkAll(checked)
    this.setData({
      cartItems: this.data.cartItems,
      totalPrice: cart.checkedPrice,
      totalSkuCount: cart.checkedCount
    })
  }

})