// pages/my-coupon/my-coupon.js
import {Coupon} from "../../models/coupon";

Page({

  data: {
    coupons: null
  },

  onLoad: async function (options) {
    const res = await Coupon.getMySelfWithCategory()
    const coupons = res.data
    this.setData({
      coupons
    })
  },

})