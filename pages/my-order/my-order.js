// pages/my-order/my-order.js
import {OrderStatus} from "../../core/enum";
import {Order} from "../../models/order";

Page({

  /**
   * Page initial data
   */
  data: {
    activeKey:OrderStatus.ALL,
    paging:null,
    items:[],
    loadingType:'loading',
    bottomLoading:true,
  },

  onLoad: function (options) {
    const activeKey = options.key
    this.data.activeKey = options.key
    this.initItems(activeKey)
  },

  onShow() {
    this.initItems(this.data.activeKey)
  },

  async initItems(activeKey) {
    wx.lin.hideEmpty()
    this.setData({
      activeKey,
      items:[]
    })
    this.data.paging = this.getPaging(activeKey)
    const data = await this.data.paging.getMoreData()
    console.log(data)
    if(!data){
      return
    }
    this.bindItems(data)
  },

  getPaging(activeKey) {
    activeKey = parseInt(activeKey)
    switch (activeKey) {
      case OrderStatus.ALL:
        return Order.getPagingByStatus(OrderStatus.ALL)
      case OrderStatus.UNPAID:
        return Order.getPagingUnpaid()
      case OrderStatus.PAID:
        return Order.getPagingByStatus(OrderStatus.PAID)
      case OrderStatus.DELIVERED :
        return Order.getPagingByStatus(OrderStatus.DELIVERED)
      case OrderStatus.FINISHED :
        return Order.getPagingByStatus(OrderStatus.FINISHED)
    }
  },

  bindItems(data) {
    if(data.empty){
      this.empty()
      return
    }
    if (data.accumulator.length !== 0){
      this.setData({
        items:data.accumulator,
        bottomLoading:true
      });
    }
    if(!data.moreData){
      this.setData({
        loadingType:'end'
      })
    }
  },

  onSegmentChange(event) {
    const activeKey = event.detail.activeKey
    this.initItems(activeKey)
  },

  async onReachBottom() {
    const data = await this.data.paging.getMoreData()
    this.bindItems(data)
  },

  empty() {
    wx.lin.showEmpty({
      text:'暂无相关订单',
    })
    this.setData({
      bottomLoading:false
    })
  },

  onPaySuccess(event) {
    const oid = event.detail.oid
    wx.navigateTo({
      url:`/pages/pay-success/pay-success?oid=${oid}`
    })
    // this.initItems(2)
  }

})