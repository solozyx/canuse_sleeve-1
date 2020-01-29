import {HistoryKeyword} from "../../models/history-keyword";
import {Tag} from "../../models/tag";

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
  onLoad: async function (options) {
    const historyTags = history.get()
    const hotTags = await Tag.getSearchTags()
    this.setData({
      historyTags,
      hotTags
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