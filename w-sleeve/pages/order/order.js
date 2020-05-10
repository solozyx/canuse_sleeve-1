import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Coupon} from "../../models/coupon";
import {Order} from "../../models/order";

const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: async function (options) {
    let orderItems;
    let localItemCount
    const skuIds = cart.getCheckedSkuIds()
    orderItems = await this.getCartOrderItems(skuIds)
    localItemCount = skuIds.length

    const order = new Order(orderItems, localItemCount)
    try {
      order.checkOrderIsOk()
    } catch (e) {
      console.error(e)
      // this.setData({
      //     isOk: false
      // })
      return
    }

    const coupons = await Coupon.getMySelfWithCategory()
    console.log(coupons.data)
  },

  async getCartOrderItems(skuIds) {
    // 同步最新的SKU数据
    const skus = await Sku.getSkusByIds(skuIds)
    const orderItems = this.packageOrderItems(skus)
    return orderItems
  },

  packageOrderItems(skus) {
    return skus.map(sku => {
      const count = cart.getSkuCountBySkuId(sku.id)
      return new OrderItem(sku, count)
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