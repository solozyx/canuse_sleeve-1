// pages/home/home.js

import {Theme} from "../../models/theme";
import {Banner} from "../../models/banner";
import {Category} from "../../models/category";
import {Activity} from "../../models/activity";
import {SpuPaging} from "../../models/spu-paging";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeA: null,
    themeE: null,
    bannerB: null,
    grid:[],
    activityD: null,
    themeF: null,
    bannerG: null,
    themeESpu: [],
    themeH: null,
    spuPaging: null,
    loadingType:'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    this.initAllData()
    this.initBottomSpuList()
  },

  async initBottomSpuList() {
    const paging = SpuPaging.getLatestPaging()
    this.data.spuPaging = paging
    const data = await paging.getMoreData()
    if (!data) {
      return
    }
    //refresh 是否清空瀑布流数据
    wx.lin.renderWaterFlow(data.items, false)
  },

  async initAllData() {
    const theme = new Theme()
    await theme.getThemes()
    const themeA = theme.getHomeLocationA()
    const themeE = theme.getHomeLocationE()
    const themeF = theme.getHomeLocationF()
    let themeESpu = []
    if (themeE.online) {
      const data = await Theme.getHomeLocationESpu()
      if (data) {
        themeESpu = data.spu_list.slice(0,8)
      }
    }
    const bannerB = await Banner.getHomeLocationB()
    const grid = await Category.getHomeLocationC()
    const activityD = await Activity.getHomeLocationD()
    const bannerG = await Banner.getHomeLocationG()
    const themeH = theme.getHomeLocationH()
    this.setData({
      themeA,
      bannerB,
      activityD,
      themeE,
      themeESpu,
      grid,
      themeF,
      bannerG,
      themeH
    })
  },

  onReachBottom: async function () {
    const data = await this.data.spuPaging.getMoreData()
    if (!data) {
      return
    }
    wx.lin.renderWaterFlow(data.items)
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },

  itemtap(event) {
    const id = event.detail.id
    wx.navigateTo({
      url: `/pages/detail/detail?pid=${id}`
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})