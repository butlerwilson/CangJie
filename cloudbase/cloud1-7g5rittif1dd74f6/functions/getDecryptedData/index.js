// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7g5rittif1dd74f6'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 如果用户从未登陆，则创建新 entry
  var res = await db.collection("user_info")
                    .where({
                      _id: _.eq(wxContext.OPENID)
                    })
                    .get()
  if (!res.length) {
    db.collection("user_info").add({
      data: {
        _id: wxContext.OPENID,
        chars: []
      }
    })
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}