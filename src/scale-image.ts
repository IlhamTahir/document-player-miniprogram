Component({
  externalClasses: ['inner-class'],
  properties: {
    src: String,
    custom_class: String,
    width: {
      type: String
    },
    height: {
      type: String,
      observer(newVal) {
        this.setData({
          // eslint-disable-next-line radix
          initOffset: ((parseInt(newVal) - this.data.touch.baseHeight) / 2)
        })
      }
    }
  },
  data: {
    isLoading: true,
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: '50%',
      baseHeight: '50%',
      scaleWidth: null,
      scaleHeight: null
    },
    initOffset: 0
  },
  lifetimes: {
    attached() {
      this._resizeToWidth(this.properties.width, this.properties.height)
    }
  },
  methods: {
    touchstartCallback(e) {
      // 单手指缩放开始，也不做任何处理
      if (e.touches.length !== 2) return

      const xMove = e.touches[1].clientX - e.touches[0].clientX
      const yMove = e.touches[1].clientY - e.touches[0].clientY
      const distance = Math.sqrt(xMove * xMove + yMove * yMove)
      this.setData({
        'touch.distance': distance,
      })
    },
    touchmoveCallback(e) {
      const windowHeight = wx.getSystemInfoSync().windowHeight
      const imgY = (windowHeight - this.data.touch.scaleHeight) / 2
      const touch = this.data.touch
      // 单手指缩放我们不做任何操作
      if (e.touches.length !== 2) return
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
      if (newScale <= 1) {
        newScale = 1
      }
      const scaleWidth = newScale * touch.baseWidth
      const scaleHeight = newScale * touch.baseHeight
      // 赋值 新的 => 旧的
      this.setData({
        'touch.distance': distance,
        'touch.scale': newScale,
        'touch.scaleWidth': scaleWidth,
        'touch.scaleHeight': scaleHeight,
        'touch.diff': distanceDiff,
        initOffset: imgY
      })
    },
    bindload(e) {
      if (this.data.src !== './assets/loading.gif') {
        this.setData({
          isLoading: false
        })
      }
      const targetWidth = e.detail.width
      const targetHeight = e.detail.height
      this._resizeToWidth(targetWidth, targetHeight)
    },
    resize() {
      const targetWidth = this.data.touch.baseWidth
      const targetHeight = this.data.touch.baseHeight
      this._resizeToWidth(targetWidth, targetHeight)
    },
    _resizeToWidth(targetWidth, targetHeight) {
      const width = this.properties.width
      const height = (width * targetHeight) / targetWidth
      this.setData({
        'touch.baseWidth': width,
        'touch.baseHeight': height,
        'touch.scaleWidth': width,
        'touch.scaleHeight': height,
        initOffset: (this.properties.height - height) / 2
      })
    },
    _resizeToHeight(targetWidth, targetHeight) {
      const height = this.properties.height
      const width = (height * targetHeight) / targetWidth
      this.setData({
        'touch.baseWidth': width,
        'touch.baseHeight': height,
        'touch.scaleWidth': width,
        'touch.scaleHeight': height
      })
    }
  }
})
