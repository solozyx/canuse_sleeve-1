// pages/detail/detail.js
import {Spu} from "../../models/spu";
import {ShoppingWay} from "../../core/enum";
import {SaleExplain} from "../../models/sale-explain";
import {getWindowHeightRpx} from "../../utils/system";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRealm: false,
    orderWay: String
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)

    const explain = await SaleExplain.getFixed()
    const height = await getWindowHeightRpx()
    const h = height - 100

    this.setData({
      spu,
      explain,
      h
    })
  },

  onGotoHome(event) {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  onGotoCart(event) {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },

  onAddToCart(event) {
    this.showRealm()
    this.setData({
      orderWay: ShoppingWay.CART
    })
  },

  onBuy(event) {
    this.showRealm()
    this.setData({
      orderWay: ShoppingWay.BUY
    })
  },

  onShopping(event) {
    const chosenSku = event.detail.sku
    const skuCount = event.detail.skuCount
    if (event.detail.orderWay == ShoppingWay.CART) {

    }
  },

  showRealm() {
    this.setData({
      showRealm: true
    })
  },

  onSpecChange(event) {
    this.setData({
      specs: event.detail
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})