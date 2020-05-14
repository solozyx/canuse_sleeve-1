// components/my-order-item/index.js
import {OrderDetail} from "../../models/order-detail";
import {Payment} from "../../models/payment";

Component({
  /**
   * Component properties
   */
  externalClasses: ['l-class'],
  properties: {
    item: Object,
  },

  /**
   * Component initial data
   */
  data: {
    _item:Object,
  },

  observers: {
    'item, currentStatus': function (item) {
      if (!item) {
        return
      }
      const order = new OrderDetail(item)
      // // this.setData({
      // //     statusText: this.orderStatusText(item.status),
      // // })
      // this.correctOrderStatus(item)
      this.setData({
        _item:order
      })
    }
  },

  attached() {
    console.log(this.properties.item)
  },

  /**
   * Component methods
   */
  methods: {
    onGotoDetail(event) {
      console.log(this.data._item)
      const oid = this.data._item.id
      wx.navigateTo({
        url:`/pages/order-detail/order-detail?oid=${oid}`
      })
    },

    onCountdownEnd(event) {
      this.data._item.correctOrderStatus()
      this.setData({
        _item: this.data._item
      })
    },

    async onPay(event) {
      const oid = this.data._item.id;

      if (!oid) {
        return
      }
      wx.lin.showLoading({
        type: "flash",
        fullScreen: true,
        color: "#157658"
      })
      const payParams = await Payment.getPayParams(oid)
      // let payStatus = OrderStatus.UNPAID
      let res
      try {
        res = await Payment.pay(payParams)
        // payStatus = OrderStatus.PAID
        wx.lin.hideLoading()
        console.log(res)
        this.triggerEvent('paysuccess',{
          oid
        })
      } catch (e) {
        console.error(e)
        wx.lin.hideLoading()
      }
      // //必须使用redirectTo防止Order页面被频繁打开
      // wx.redirectTo({
      //     url: `/pages/my-order/my-order?key=${payStatus}`
      // })
    }
  }
})
