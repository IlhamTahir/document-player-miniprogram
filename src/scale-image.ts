Component({
  externalClasses: ['inner-class'],
  properties: {
    src: String,
    custom_class: String
  },
  data: {
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    }
  },
  methods: {
    touchstartCallback(e) {
      // 单手指缩放开始，也不做任何处理
      if (e.touches.length !== 2) return
      // 注意touchstartCallback 真正代码的开始
      // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
      // 当两根手指放上去的时候，就将distance 初始化。
      const xMove = e.touches[1].clientX - e.touches[0].clientX
      const yMove = e.touches[1].clientY - e.touches[0].clientY
      const distance = Math.sqrt(xMove * xMove + yMove * yMove)
      this.setData({
        'touch.distance': distance,
      })
    },
    touchmoveCallback(e) {
      const touch = this.data.touch
      // 单手指缩放我们不做任何操作
      if (e.touches.length !== 2) return
      console.log('双手指运动')
      const xMove = e.touches[1].clientX - e.touches[0].clientX
      const yMove = e.touches[1].clientY - e.touches[0].clientY
      // 新的 ditance
      const distance = Math.sqrt(xMove * xMove + yMove * yMove)
      const distanceDiff = distance - touch.distance
      let newScale = touch.scale + 0.005 * distanceDiff
      // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
      if (newScale >= 2) {
        newScale = 2
      }
      if (newScale <= 0.6) {
        newScale = 0.6
      }
      const scaleWidth = newScale * touch.baseWidth
      const scaleHeight = newScale * touch.baseHeight
      // 赋值 新的 => 旧的
      this.setData({
        'touch.distance': distance,
        'touch.scale': newScale,
        'touch.scaleWidth': scaleWidth,
        'touch.scaleHeight': scaleHeight,
        'touch.diff': distanceDiff
      })
    },
    bindload(e) {
      // bindload 这个api是<image>组件的api类似<img>的onload属性
      const width = wx.getSystemInfoSync().windowWidth
      const height = (width * e.detail.height) / e.detail.width
      this.setData({
        'touch.baseWidth': width,
        'touch.baseHeight': height,
        'touch.scaleWidth': width,
        'touch.scaleHeight': height
      })
    }
  }
})
