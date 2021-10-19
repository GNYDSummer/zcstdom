const app = getApp()
const aliyunOpt = require('../../../utils/aliyun_connect.js');
var mqtt = require('../../../utils/mqtt.min.js')
const aliSdk = require("../../../utils/aliIot-sdk.js")


Page({
  data: {
    img_url: "../../../static/images/door_close.png",
    password_input: "",
    key: "123456",
    login: false,
    button_clicking: true,
    pubTopic: '/a1jp65jcLYD/Applets/user/Door_lock_control' //发布消息的主题
  },

  onLoad: function () {
    this.loadData()
    // var that = this;
  },

  loadData: function () {
    var that = this
    aliSdk.request({
        Action: "QueryDevicePropertyStatus",
        ProductKey: app.globalData.productKey,
        DeviceName: app.globalData.deviceName
      }, {
        method: "POST"
      },
      (res) => {
        console.log("success")
        //console.log(res) //查看返回response数据
        if (res.data.Code) {
          console.log(res.data.ErrorMessage)
          wx.showToast({
            title: '设备连接失败',
            icon: 'none',
            duration: 1000,
            complete: () => {}
          })
        }
      },
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          complete: () => {}
        })
        //this.setPropertyData(null)
      },
      (res) => {
        console.log("complete")
      })
  },
  
  // 密码输入
  inputPwd: function (e) {
    this.setData({
      password_input: e.detail.value
    })
  },

  confirmPwd: function () {
    var pwd = this.data.password_input;
    var that = this
    if (pwd != this.data.key) {
      wx.showToast({
        title: '密码错误',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '验证通过',
        icon: 'success',
        duration: 2000
      })
      wx.setStorage({
        key: "password",
        data: pwd,
      })
      this.login()
    }
  },

  login: function () {
    var that = this
    wx.getStorage({
      key: 'password',
      success(res) {
        //console.log(res)
        var pwd = res.data
        if (pwd == that.data.key) {
          that.setData({
            login: true
          })
        }
      }
    })
  },

  // 门锁消息发布
  command_opendoor() {
    var that = this
    console.log("开门")
    that.button_style()
    let context = '1'
    app.globalData.client.publish(that.data.pubTopic, context, null)
  },

  button_style() {
    var that = this
    this.setData({
      img_url: "../../../static/images/door_open.png",
      button_clicking: true
    })
    setTimeout(function () {
      that.setData({
        img_url: "../../../static/images/door_close.png",
        button_clicking: false
      })
    }, 2000)
  },

  cancelPwd: function (e) {
    // var that = this
    wx.navigateBack({
      delta: 1,
    })
  },

  closeDev: function () {
    // var that = this
    wx.navigateBack({
      delta: 1,
    })
  }

})