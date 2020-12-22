Page({
  data: {
    playPages: [
      1,
      4,
      5,
      6,
      12,
      25
    ],
    showPageChange: false
  },
  onLoad(query) {
  },
  onReady() {
  },
  goSeven() {
    const child = this.selectComponent('.document-area')
    child.goto({page: 3})
  },
  goFirstPage() {
    const child = this.selectComponent('.document-area')
    child.goto({page: 1})
  },
  onChange(e) {
    if (this.data.showPageChange) {
      wx.showToast({
        title: `切换至第${e.detail.page}页`
      })
    }
  },
  toggleShowPage(e) {
    this.setData({
      showPageChange: e.detail.value
    })
  }
})
