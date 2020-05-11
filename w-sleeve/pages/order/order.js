import {Cart} from "../../models/cart";
import {Sku} from "../../models/sku";
import {OrderItem} from "../../models/order-item";
import {Coupon} from "../../models/coupon";
import {Order} from "../../models/order";
import {CouponOperate, ShoppingWay} from "../../core/enum";
import {CouponBO} from "../../models/coupon-bo";
import {showToast} from "../../utils/ui";

const cart = new Cart()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,

    address: null,

    submitBtnDisable: false,
    shoppingWay: ShoppingWay.BUY,
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: async function (options) {
    let orderItems;
    let localItemCount

    const shoppingWay = options.way
    this.data.shoppingWay = shoppingWay

    if (shoppingWay === ShoppingWay.BUY) {
      const skuId = options.sku_id
      const count = options.count
      orderItems = await this.getSingleOrderItems(skuId, count)
      localItemCount = 1
    } else {
      const skuIds = cart.getCheckedSkuIds()
      orderItems = await this.getCartOrderItems(skuIds)
      localItemCount = skuIds.length
    }

    const order = new Order(orderItems, localItemCount)
    this.data.order = order

    try {
      order.checkOrderIsOk()
    } catch (e) {
      console.error(e)
      this.setData({
          isOk: false
      })
      return
    }

    const res = await Coupon.getMySelfWithCategory()
    const coupons = res.data
    const couponBOList = this.packageCouponBOList(coupons, order)
    this.setData({
      orderItems,
      couponBOList,
      totalPrice: order.getTotalPrice(),
      finalTotalPrice: order.getTotalPrice()
    })
  },

  async getCartOrderItems(skuIds) {
    // 同步最新的SKU数据
    const skus = await Sku.getSkusByIds(skuIds)
    const orderItems = this.packageOrderItems(skus)
    return orderItems
  },

  async getSingleOrderItems(skuId, count) {
    const skus = await Sku.getSkusByIds(skuId)
    return [new OrderItem(skus[0], count)];
  },

  packageOrderItems(skus) {
    return skus.map(sku => {
      const count = cart.getSkuCountBySkuId(sku.id)
      return new OrderItem(sku, count)
    })
  },

  packageCouponBOList(coupons, order) {
    return coupons.map(coupon => {
      const couponBO = new CouponBO(coupon)
      couponBO.meetCondition(order)
      return couponBO
    })
  },

  onChooseCoupon(event) {
    const couponObj = event.detail.coupon
    const couponOperate = event.detail.operate

    if (couponOperate === CouponOperate.PICK) {
      this.data.currentCouponId = couponObj.id
      const priceObj = CouponBO.getFinalPrice(this.data.order.getTotalPrice(), couponObj)
      this.setData({
        finalTotalPrice: priceObj.finalPrice,
        discountMoney: priceObj.discountMoney
      })
    } else {
      this.data.currentCouponId = null
      this.setData({
        finalTotalPrice: this.data.order.getTotalPrice(),
        discountMoney: 0
      })
    }

  },

  onChooseAddress(event) {
    const address = event.detail.address
    this.data.address = address
  },

  onSubmit() {
    if (!this.data.address) {
      showToast('请选择收获地址')
      return
    }
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