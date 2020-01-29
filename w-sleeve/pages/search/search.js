import {HistoryKeyword} from "../../models/history-keyword";
import {Tag} from "../../models/tag";
import {Search} from "../../models/search";
import {showToast} from "../../utils/ui";

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

  async onSearch(event) {
    const keyword = event.detail.value || event.detail.name
    if (!keyword) {
      showToast("请输入关键字")
      return
    }
    this.setSearchStatus(true)
    history.save(keyword)
    this.setHistoryTags()
    this.showLoading()
    const paging = Search.search(keyword)
    const data = await paging.getMoreData()
    this.bindItems(data)
    this.hideLoading()
  },

  showLoading() {
    wx.lin.showLoading({
      color: '#157658',
      type: 'flash',
      fullScreen: true
    })
  },

  hideLoading() {
    wx.lin.hideLoading()
  },

  onCancel() {
    this.setSearchStatus(false)
  },

  onDeleteHistory() {
    history.clear()
    this.setHistoryTags()
  },

  bindItems(data){
    if (data.accumulator.length != 0) {
      this.setData({
        items: data.accumulator
      })
    }
  },

  setSearchStatus(search) {
    this.setData({
      search
    })
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