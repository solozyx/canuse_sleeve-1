import {HistoryKeyword} from "../../models/history-keyword";

const history = new HistoryKeyword()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historytTags: Array
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const historyTags = history.get()
    this.setData({
      historyTags
    })
  },

  onSearch(event) {
    const keyword = event.detail.value
    history.save(keyword)
    this.setHistoryTags()
  },

  onDeleteHistory() {
    history.clear()
    this.setHistoryTags()
  },

  setHistoryTags() {
    const historyTags = history.get()
    this.setData({
      historyTags
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})