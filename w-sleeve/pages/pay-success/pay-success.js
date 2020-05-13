// pages/pay-success/pay-success.js
Page({

  /**
   * Page initial data
   */
  data: {
    oid:null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.data.oid = options.oid
    // wx.lin.showStatusShow({
    //     type: 'success'
    // })
  },

  onGotoOrderDetail(event) {
    wx.redirectTo({
      url:`/pages/order-detail/order-detail?oid=${this.data.oid}`
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})