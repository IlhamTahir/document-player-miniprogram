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
    toc: [
      {
        title: '第二十章 抗肿瘤药物 (Anticancer Drugs)',
        key: 1,
        children: [{
          title: '第一节 直接作用',
          key: 1,
          children: [{title: '一、烷化剂', key: 4, children: []}]
        }]
      },
      {
        title: '第二十一章 你好吗？',
        key: 5,
        children: []
      }
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
