// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7g5rittif1dd74f6'
})

function charListAppend(ans, char_list, char) {
  ans.push(char_list.length)
  char_list.push({
    "char": char,
    "ans_index": -1
  })
}

function ansListAppend(ans_list, char_list, ans, char) {
  for (let i = 0; i < ans.length; ++i) {
    char_list[ans[i]]["ans_index"] = ans_list.length
  }
  ans_list.push({
    "ans": ans,
    "char": char
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var res = await cloud.callFunction({
    name: "randomGetter",
    data: {
      size: event.size
    }
  })
  var chars = res.result.list
  var idx = 0, len = chars.length
  var char_list = [], ans_list = []
  // ans* 用来记录答案的在 list 中的坐标
  var ans1 = [], ans2 = [], ptr1 = 0, ptr2 = 0
  for (; idx < len - 1;) {
    // 分别从两个字中的所有组合中任选一个
    var index1 = Math.floor((Math.random()*chars[idx].value.length));
    var index2 = Math.floor((Math.random()*chars[idx + 1].value.length));
    var char_list1 = chars[idx].value[index1]
    var char_list2 = chars[idx + 1].value[index2]
    // 随机从两个部首列表中随机挑选加入呈现的列表中
    while (ptr1 < char_list1.length && ptr2 < char_list2.length) {
      var p = Math.random()
      if (p > 0.5) charListAppend(ans1, char_list, char_list1[ptr1++])
      else charListAppend(ans2, char_list, char_list2[ptr2++])
    }
    if (ptr1 == char_list1.length) {
      // 如果是第一个先全部填入呈现的列表中，则将第二个字设置为第一个
      ansListAppend(ans_list, char_list, ans1, chars[idx].key)
      ans1 = ans2
      ans2 = []
      ptr1 = ptr2
      ptr2 = 0
      idx++
    } else {
      // 如果是第二个先，则直接将第一个字剩下的所有部首填入呈现的列表
      while (ptr1 < char_list1.length) charListAppend(ans1, char_list, char_list1[ptr1++])
      ansListAppend(ans_list, char_list, ans2, chars[idx + 1].key)
      ansListAppend(ans_list, char_list, ans1, chars[idx].key)
      ans1 = [], ans2 = []
      ptr1 = 0, ptr2 = 0
      idx += 2
    }
  }
  // 防止最后一个字没有返回给前端
  if (idx == len - 1) {
    var ptr = 0, last_ans = []
    var index = Math.floor((Math.random()*chars[idx].value.length));
    var last_char_list = chars[idx].value[index]
    while (ptr < last_char_list.length) charListAppend(last_ans, char_list, last_char_list[ptr++])
    ansListAppend(ans_list, char_list, last_ans, chars[idx].key)
  }

  return {
    "char_list": char_list,
    "ans_list": ans_list
  }
}