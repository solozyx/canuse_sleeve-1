// pages/cart/cart.js
import {Cart} from "../../models/cart";
import {Calculator} from "../../models/calculator";

const cart = new Cart()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const cart = new Cart()
    const cartItems = cart.getAllCartItemFromLocal().items
    if (cart.isEmpty()) {
      this.empty()
      return
    }
    this.setData({
      cartItems: cartItems
    })
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
    const checkedItems = cart.getCheckedItems()
    const calculator = new Calculator(checkedItems)
    calculator.calc()
    this.setCalcData(calculator)
  },

  setCalcData(calculator) {
    const totalPrice = calculator.getTotalPrice()
    const totalSkuCount = calculator.getTotalSkuCount()
    this.setData({
      totalPrice,
      totalSkuCount
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
  }

})