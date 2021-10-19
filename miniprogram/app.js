// app.js

App({
  onLaunch() {
     wx.cloud.init({
       env: 'cloud1-7gqlm6bqafbf4a4f', // 云开发环境id
       traceUser: 'true'
     })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  // 静态属性
  globalData:{
    client: null, //记录重连的次数
    as: "VU91kuBACI6578yfjM0wRlEenBGMnx", //AccessKey Secret
    productKey: "a1jp65jcLYD", 
    deviceName: "Applets",
    endpoint: "https://iot.cn-shanghai.aliyuncs.com",
    ai: "LTAI5tDnWgJ3LYFfr2fmfbxZ", //AccessKeyId
    apiVersion: '2018-01-20',
    userInfo: null
  }
})

