// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7g5rittif1dd74f6'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    return db.collection("chars_with_res")
             .aggregate()
             .sample({
               size: event.size
             })
             .limit(event.size)
             .end()
  } catch (e) {
    console.log(e)
  }
}