// pages/repair/repair.js
const DB = wx.cloud.database().collection("user")
const app = getApp()
//全局变量
let stuId = ""
let stuName = ""
let stuPhone = ""
let stuDormitory = ""
let stuDormitoryNum = ""
let deviceId = ""
let errMessage = ""
let form_info = ""
Page({
  //获取用户输入的id
  addStuId(event) {
    stuId = event.detail.value
  },
  //获取用户输入的name
  addStuName(event) {
    stuName = event.detail.value
  },
  //获取用户输入的phone
  addStuPhone(event) {
    stuPhone = event.detail.value
  },
  //获取用户输入的dormitory
  addStuDormitory(event) {
    stuDormitory = event.detail.value
  },
  //获取用户输入的dormitoryNum
  addStuDormitoryNum(event) {
    stuDormitoryNum = event.detail.value
  },
  //获取用户输入的deviceId
  addDeviceId(event) {
    deviceId = event.detail.value
  },
  //获取用户输入的errMessage
  addErrMessage(event) {
    errMessage = event.detail.value
  },

  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    wx.request({
      url: util.apiUrl + 'repair/formSubmit?program_id=' + app.jtappid,
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.statu == 1) {
          wx.showToast({
            title: '提交成功',
          })
          that.setData({
            form_info: ''
          })
        }
      }
    })
  },

  //添加数据
  addData() {
    DB.add({
      data: {
        stuId: stuId,
        stuName: stuName,
        stuPhone: stuPhone,
        stuDormitory: stuDormitory,
        stuDormitoryNum: stuDormitoryNum,
        deviceId: deviceId,
        errMessage: errMessage
      },
      success(res) {
        console.log("添加成功", res)
      },
      fail(res) {
        console.log("添加失败", res)
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {

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