import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'
// wx.getUserProfile({
//   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
//   success: (res) => {
//     console.log(res);
//     new Main();
//   }
// });

wx.login({
  success (res) {
    console.log(res);
    wx.getSetting({
      success(res) {
        if(!res.authSetting['scope.userInfo']){
          wx.authorize({
            scope: 'scope.userInfo',
            success(){
            }
          })
        }
        wx.getUserInfo({
          success(res) {
            console.log(res);
          }
        })
      }
    })
  }
})
