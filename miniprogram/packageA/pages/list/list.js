// pages/list/list.js
const app = getApp()
const aliyunOpt = require('../../../utils/aliyun_connect.js');
var mqtt = require('../../../utils/mqtt.min.js')
const aliSdk = require("../../../utils/aliIot-sdk.js")

Page({
  data: {
    temp: 23,
    isOpen: false,
    // img_url: "../../../static/images/switch.png",
    // hide: false,
    pubTopic: '/a1jp65jcLYD/Applets/user/air_conditioner_control' //发布消息的主题

  },
  onLoad: function (options) {
    this.loadData()
    // var that = this;
    // that.data.client.on('connect', function (connack) {
    //   that.data.client.subscribe(that.data.aliyunInfo.subTopic, function (err) {
    //     if (!err) {
    //       console.log("成功订阅设备上行数据Topic！");
    //     }
    //   })
    //   // wx.showToast({
    //   //   title: '连接成功'
    //   // })
    // })
  },

  addTemp(event) {
    // console.log(this.temp)
    this.data.temp = event.detail.value
  },

  adData(event) {
    var that = this
    //console.log(event);
    let temp = that.data.temp //前端显示的温度
    //console.log("当前显示温度：" + temp);
    var context = 'O' + temp
    console.log("发送温度" + temp);
    if(this.data.isOpen)
      app.globalData.client.publish(that.data.pubTopic, context, null)
  },

  onAirConChange(event) {
    // 空调开关
    this.data.isOpen = event.detail.value
  },

  // 关闭空调
  closeAir(event){
    var that = this
    if(!this.data.isOpen)
    {
      app.globalData.client.publish(that.data.pubTopic, "C", null)
      console.log("关闭空调");
    }
  },
  onClickUp: function () {
    this.data.temp += 1
    this.setData({temp: this.data.temp})
    //console.log(this.data.temp);
  },
  onClickDown: function () {
    this.data.temp -= 1
    this.setData({temp: this.data.temp})
    //console.log(this.data.temp);
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
        //console.log("success")
        //console.log(res) //查看返回response数据
        if (res.data.Code) {
          //console.log(res.data.ErrorMessage)
          wx.showToast({
            title: '设备连接失败',
            icon: 'none',
            duration: 1000,
            complete: () => {}
          })
          //that.setPropertyData(null)
        } else {
          ;
          //that.setPropertyData(res.data.Data.List.PropertyStatusInfo)
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

  //设置前端数据
  //setPropertyData: function (infos) {
    //;
    // var that = this
    // if (infos) {
    //   var propertys = that.convertPropertyStatusInfo(infos)
    //   that.setData({
    //     isOpen: propertys.temp,
    //   })
    // } else {
    //   that.setData({
    //     temp: 23,
    //   })
    // }
  //},

  //将返回结果转成key,value的json格式方便使用
  convertPropertyStatusInfo: function (infos) {
    var data = {}
    infos.forEach((item) => {
      data[item.Identifier] = item.Value ? item.Value : null
    })
    return data
  },

  //调用服务改变设备状态
  changeDeviceStatus: function () {
    var that = this
    //防止重复点击
    that.setData({
      buttonDisabled: true
    })

    aliSdk.request({
        Action: "InvokeThingService",
        ProductKey: app.globalData.productKey,
        DeviceName: app.globalData.deviceName,
        Identifier: that.data.openedDevice ? "CloseDevice" : "OpenDevice",
        Args: "{}" //无参服务，所以传空
      }, {
        method: "POST"
      },
      (res) => {
        console.log("success")
        console.log(res) //查看返回response数据
        that.setData({
          openedDevice: !that.data.openedDevice
        })
      },
      (res) => {
        console.log("fail")
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 1000,
          complete: () => {}
        })
      },
      (res) => {
        console.log("complete")
        that.setData({
          buttonDisabled: false
        })
      })
  },
  close: function (e) {
    var that = this
    wx.navigateBack({
      delta: 1,
    })
  }

})