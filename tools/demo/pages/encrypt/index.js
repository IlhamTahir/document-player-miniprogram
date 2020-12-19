Page({
  onLoad(query) {
  },
  onReady() {
  },
  goSeven() {
    const child = this.selectComponent('.document-player')
    child.goto({page: 7})
  },
  goFirst() {
    const child = this.selectComponent('.document-player')
    child.goto({page: 1})
  },
  onChange(e) {
    console.log(e)
  }
})
