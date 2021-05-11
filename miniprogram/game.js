import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'

// new Main()

wx.login({
  success (res) {
    console.log(res);
    wx.getSetting({
      success(res) {
        if(!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(){
              wx.getUserInfo({
                success(res) {
                  console.log(res);
                  wx.cloud.callFunction({
                    name: "getDecryptedData",
                    data: {
                      decryptedData: wx.cloud.CloudID(res.cloudID)
                    }
                  }).then(res => {
                    console.log(res);
                  }).catch(err => {
                    console.log(err);
                  });
                }
              })
            }
          })
        } else {
          wx.getUserInfo({
            success(res) {
              console.log(res);
              wx.cloud.callFunction({
                name: "getDecryptedData",
                data: {
                  decryptedData: wx.cloud.CloudID(res.cloudID)
                }
              }).then(res => {
                console.log(res);
              }).catch(err => {
                console.log(err);
              });
            }
          })
        }
      }
    })
  }
})