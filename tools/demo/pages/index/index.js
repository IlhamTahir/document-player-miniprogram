Page({
  data: {},
  onLoad(options) {
  },
  toEncrypt() {
    wx.navigateTo({
      url: '/pages/encrypt/index'
    })
  },
  toNoEncrypt() {
    wx.navigateTo({
      url: '/pages/no-encrypt/index'
    })
  },
  toFullScreen() {
    wx.navigateTo({
      url: '/pages/fullscreen/index'
    })
  }
})
