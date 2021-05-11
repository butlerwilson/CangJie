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

  var userInfo = await db.collection("user_info")
                         .where({
                           _id: _.eq(wxContext.OPENID)
                         })
                         .get()
  var set = new Set(userInfo.data[0].chars), new_set = event.chars;
  new_set.forEach((a) => {
    set.add(a);
  })
  var new_array = []
  set.forEach((a) => {
    new_array.push(a);
  })
  return await db.collection("user_info")
                 .where({
                   _id: _.eq(wxContext.OPENID)
                 })
                 .update({
                   data: {
                    chars: new_array
                   }
                 });

}