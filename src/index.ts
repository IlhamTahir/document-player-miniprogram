import {ContentPosition, ImgItem} from './types'

Component({
  properties: {
    imageUrlPrefix: {
      type: String
    },
    totalPage: {
      type: Number
    },
    encryptKey: {
      type: String
    },
    encryptIv: {
      type: String
    },
    startPage: {
      type: Number
    },
    defaultPosition: {
      type: Object,
      required: false
    }
  },
  data: {
    position: {
      page: 4
    } as ContentPosition,
    imageList: [] as Array<ImgItem>,
    isFullscreen: false
  },
  lifetimes: {
    attached() {
      this.init()
    }
  },
  methods: {
    init() {
      // this.data.position.page = 0
      const list = []
      for (let i = 1; i <= this.properties.totalPage; i++) {
        const img = {
          src: this.properties.imageUrlPrefix + i,
          page: i,
          active: (i === 1),
        } as ImgItem
        list.push(img)
      }
      console.log(list)
      this.setData({
        imageList: list
      })
    },

    async goto(position: ContentPosition) {
      let page = position.page
      if (page < 1) {
        page = 1
      }
      if (page > this.imgList.length) {
        page = this.imgList.length
      }

      if (this.position.page === page) {
        return
      }

      this.position.page = page

      let oldActiveImg: ImgItem | undefined
      for (const img of this.imgList) {
        if (img.active) {
          oldActiveImg = img
        }
      }

      let newActiveImg: ImgItem | undefined
      for (const img of this.imgList) {
        if (img.page === page) {
          newActiveImg = img
        }
      }

      if (oldActiveImg && newActiveImg && oldActiveImg.page === newActiveImg.page) {
        return
      }

      if (oldActiveImg) {
        oldActiveImg.active = false
      }
    },
  }
})
