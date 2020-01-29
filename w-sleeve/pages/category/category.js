// pages/category/category.js
import {getSystemSize} from "../../utils/system";
import {px2rpx} from "../../miniprogram_npm/lin-ui/utils/util";
import {Categories} from "../../models/categories";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: Object,
    defaultRootId: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
      this.setDynamicSegmentHeight()
      this.initCategoryData()
  },

  async initCategoryData() {
    const categories = new Categories()
    this.data.categories = categories
    await categories.getAll()
    const roots = categories.getRoots()
    const defaultRoot = this.getDefaultRoot(roots)
    const currentSubs = categories.getSubs(defaultRoot.id)
    this.setData({
      roots,
      currentSubs,
      currentBannerImg: defaultRoot.img
    })
  },

  getDefaultRoot(roots) {
    let defaultRoot = roots.find(s=>s.id===this.data.defaultRootId)
    if (!defaultRoot && roots.length > 0) {
      defaultRoot = roots[0]
    }
    return defaultRoot
  },

  async setDynamicSegmentHeight() {
    const height = await getWindowHeightRpx()
    const h = height - 60 - 20 - 2
    this.setData({
      segHeight: h
    })
  },

  onGotoSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  onSegChange(event) {
    const rootId = event.detail.activeKey
    const currentSubs = this.data.categories.getSubs(rootId)
    const currentRoot = this.data.categories.getRoot(rootId)
    this.setData({
      currentSubs,
      currentBannerImg: currentRoot.img
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})