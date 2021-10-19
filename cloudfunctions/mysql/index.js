// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入mysql操作模块
const mysql = require('mysql2/promise')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return cloud.database().collection("environment").get();
  try {
    const connection = await mysql.createConnection({
      host: "39.108.87.128",
      database: "gnyd",
      user: "gnydsummer",
      password: "Ln18888wynfq"
    })
    const [rows, fields] = await connection.execute('MySQL语句')
    return rows;
  } catch (err) {
    console.log("链接错误", err)
    return err
  }
}