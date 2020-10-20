import {Spu as Order} from "../../models/spu";
import {OrderDetail} from "../../models/order-detail";

Page({

  /**
   * Page initial data
   */
  data: {
    oid: null
  },

  onLoad: async function (options) {
    const oid = options.oid
    this.data.oid = oid
    const order = await Order.getDetail(oid)
    const detail = new OrderDetail(order)
    this.setData({
      order: detail
    })
  },

})