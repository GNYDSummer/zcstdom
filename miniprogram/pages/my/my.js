// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: "", //设备型号
    version: "", //微信版本
    platform: "", //客户端平台
    system: "" //操作系统
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    wx.getSystemInfo({
      success(res) {
        // console.log(res.model)
        // console.log(res.version)
        // console.log(res.platform)
        // console.log(res.system)
        that.setData({
          model: res.model,
          version: res.version,
          platform: res.platform,
          system: res.system,
        })
      }
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})