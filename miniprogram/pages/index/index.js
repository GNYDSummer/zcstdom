// index.js
const aliSdk = require("../../utils/aliIot-sdk.js")
const app = getApp()
const aliyunOpt = require('../../utils/aliyun_connect.js');
var mqtt = require('../../utils/mqtt.min.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // indoorTemp: "--", //室内温度
    // roomTemp: "--", //空调温度
    airChecked: true, //空调状态
    doorChecked: false, //宿舍门状态
    Area: "请求中", //城区
    City: "请求中", //城市
    AirText: "请求中", //空气优良
    AirValue: 0, //空气指数
    Weather: "请求中", //天气
    WeatherAdvice: "请求中", //天气建议
    deviceStatus: "关", //设备状态
    reconnectCounts: 0, //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本
      clean: false,
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true, //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
      clientId: '',
      password: '',
      username: '',
    },

    aliyunInfo: {
      productKey: 'a1jp65jcLYD', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      deviceName: 'Applets', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      deviceSecret: '74d2c2066d83e131601a3277cd516345', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      regionId: 'cn-shanghai', //阿里云连接的三元组 ，请自己替代为自己的产品信息!!
      subTopic: '/a1lNp7GBcK9/SSIbVTzgMNKrg481TDBf/user/get', //订阅消息的主题
      port: 1883
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
    var that = this;
    let clientOpt = aliyunOpt.getAliyunIotMqttClient({
      productKey: that.data.aliyunInfo.productKey,
      deviceName: that.data.aliyunInfo.deviceName,
      deviceSecret: that.data.aliyunInfo.deviceSecret,
      regionId: that.data.aliyunInfo.regionId,
      port: that.data.aliyunInfo.port
    });
    //console.log("get data:" + JSON.stringify(clientOpt));
    let host = 'wxs://' + clientOpt.host;
    that.setData({
      'options.clientId': clientOpt.clientId,
      'options.password': clientOpt.password,
      'options.username': clientOpt.username,
    })
    console.log("this.data.options host:" + host);
    //console.log("this.data.options data:" + JSON.stringify(this.data.options));

    app.globalData.client = mqtt.connect(host, that.data.options);
    app.globalData.client.on('connect', function (connack) {
      app.globalData.client.subscribe(that.data.aliyunInfo.subTopic, function (err) {
        if (!err) {
          console.log("成功订阅设备上行数据Topic！");
        }
      })
      // wx.showToast({
      //   title: '连接成功'
      // })
    })

    app.globalData.client.on("message", function (topic, payload) {
      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      wx.showModal({
        content: " 收到topic:[" + topic + "], payload :[" + payload + "]",
        showCancel: false,
      });
      let dataFromDev = {}
      dataFromDev = JSON.parse(payload)
      console.log(dataFromDev);
      that.setData({
        temp: dataFromDev.temp,
        isOpen: dataFromDev.isOpen
      })
    })
    //服务器连接异常的回调
    app.globalData.client.on("error", function (error) {
      console.log(" 服务器 error的回调" + error)

    })
    //服务器重连连接异常的回调
    app.globalData.client.on("reconnect", function () {
      console.log(" 服务器 reconnect的回调")

    })
    //服务器连接异常的回调
    app.globalData.client.on("offline", function (errr) {
      console.log(" 服务器offline的回调")
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
    this.loadData()
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        // const speed = res.speed;
        // const accuracy = res.accuracy;
        const key = "e4e51fb8d4124af8b5245332d2e6b358";
        wx.request({
          url: `https://geoapi.qweather.com/v2/city/lookup?location=${longitude},${latitude}&key=${key}`, //获取地区数据的API接口地址
          success: function (res) {
            const {
              adm2,
              name
            } = res.data.location[0];
            that.setData({
              Area: adm2,
              City: name
            })
            // console.log(adm2);
            // console.log(name);
          },
        });

        wx.request({
          url: `https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=${key}`, //获取天气数据的API接口地址
          success(res) {
            // console.log(res.data);
            const {
              now
            } = res.data;
            that.setData({
              Weather: now.text
            })
            // console.log(now);
          },
        });
        
        wx.request({
          url: `https://devapi.qweather.com/v7/air/now?location=${longitude},${latitude}&key=${key}`, //获取空气质量的API接口地址
          success(res) {
            // console.log(res.data);
            const {
              now
            } = res.data;
            // console.log(now);
            const {
              category,
              aqi
            } = now;
            that.setData({
              AirText: category,
              AirValue: aqi
            })
            that.AirText = category;
            that.AirValue = aqi;
          },
        });

        wx.request({
          url: `https://devapi.qweather.com/v7/indices/1d?type=1,2&location=${longitude},${latitude}&key=${key}`, //获取空气生活指数的API接口地址
          success(res) {
            // console.log(res.data);
            const {
              text
            } = res.data.daily[1];
            that.setData({
              WeatherAdvice: text
            })
            // console.log(text);
            that.WeatherAdvice = text;
          },
        });
      },
    });

  },
  //通过封装的sdk读取物联网平台数据
  loadData: function () {
    var that = this
    aliSdk.request({
        Action: "QueryDeviceDetail",
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
          // that.setPropertyData(null)
        } else {
          const {
            Status
          } = res.data.Data;
          that.setData({
            deviceStatus: Status
          })
          that.deviceStatus = Status;
          // that.setPropertyData(res.data.Data)
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
        // this.setPropertyData(null)
      },
      (res) => {
        console.log("complete")
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

  },

  goToList: function (e) {
    var that = this
    //console.log(e);
    wx.navigateTo({
      url: '../../packageA/pages/list/list?id=1',
      success: function (res) {
        console.log('转到温度控制界面');
        res.eventChannel.emit('getId', {
          id: e.currentTarget.id
        })
      }
    })
  },
  goToDevice: function (e) {
    var that = this
    //console.log(e);
    wx.navigateTo({
      url: '../../packageA/pages/device/device?id=1',
      success: function (res) {
        console.log('转到门锁控制界面');
        res.eventChannel.emit('getId', {
          id: e.currentTarget.id
        })
      }
    })
  },
  add: function (e) {
    var that = this
    //console.log(e);
    wx.navigateTo({
      url: '../../packageB/pages/lists/lists',
      success: function (res) {
        console.log('转到添加设备界面');
      }
    })
  }
})