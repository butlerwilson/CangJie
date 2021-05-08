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

  var char_list = event.char_list.sort()
  var res = await db.collection('chars_with_res')
                    .where({
                      value: _.elemMatch(_.eq(char_list))
                    })
                    .get()

  return res
}