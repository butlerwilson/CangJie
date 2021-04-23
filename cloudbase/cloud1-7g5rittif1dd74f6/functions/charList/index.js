// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7g5rittif1dd74f6'
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var chars = await cloud.callFunction({
    name: "randomGetter",
    data: {
      size: event.size
    }
  })
  var idx = 0, len = chars.length
  var char_list = [], ans_list = []
  var ans1 = [], ans2 = [], ptr1 = 0, ptr2 = 0
  for (; idx < len - 1; idx++) {
    var index1 = Math.floor((Math.random()*chars[idx].length));
    var index2 = Math.floor((Math.random()*chars[idx + 1].length));
    var char_list1 = chars[idx]["value"][index1]
    var char_list2 = chars[idx + 1]["value"][index2]
    while (ptr1 < char_list1.length && ptr2 < char_list2.length) {
      var p = Math.random()
      if (p > 0.5) {
        ans1.push(char_list1.length)
        char_list.push(char_list1[ptr1++])
      }
      else {
        ans2.push(char_list2.length)
        char_list.push(char_list2[ptr2++])
      }
    }
    if (ptr1 == char_list1.length) {
      ans_list.push({
        "ans": ans1,
        "char": chars[index1]["key"]
      })
      ans1 = ans2
      ans2 = []
      ptr1 = ptr2
      ptr2 = 0
    } else {
      // TODO: 将 ans1 与 char_list 填满，并且返回给 ans_list,
      // 同时还要初始化 ptr 和 idx
    }
  }

  return {
    "char_list": char_list,
    "ans_list": ans_list
  }
}