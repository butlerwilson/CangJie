// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  result = null
  await db.collection('chars_with_res')
          .aggregate()
          .sample({
            size: event.size
          }).end().then((res) => result = res)

  try {
    return result
  } catch (e) {
    console.log(e)
  }
}