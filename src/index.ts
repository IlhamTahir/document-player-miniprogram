import {ContentPageChangedEventData, ContentPosition, ImgItem} from './types'
import PromiseQueue from './promis-queue'

const preloadQueue = new PromiseQueue({concurrency: 1})

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
      this.setData({
        imageList: list
      })
      if (this.properties.defaultPosition) {
        this.goto(this.properties.defaultPosition)
      } else {
        this.goto({page: 2})
      }
    },

    goto(position: ContentPosition) {
      let page = position.page
      if (page < 1) {
        page = 1
      }
      if (page > this.data.imageList.length) {
        page = this.data.imageList.length
      }

      if (this.data.position.page === page) {
        return
      }

      this.data.position.page = page

      let oldActiveImg: ImgItem | undefined
      for (const img of this.data.imageList) {
        if (img.active) {
          oldActiveImg = img
        }
      }

      let newActiveImg: ImgItem | undefined
      for (const img of this.data.imageList) {
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
      if (newActiveImg) {
        newActiveImg.active = true

        if (!newActiveImg.load) {
          this.loadRemoteImage(newActiveImg)
        }

        const el = this.$refs['img' + newActiveImg.page] as HTMLImageElement

        this.eventChannel.emit('page-changed', {
          page,
          width: el.naturalWidth,
          height: el.naturalHeight
        } as ContentPageChangedEventData)

        this.preloadImage(page + 1)
      }
    },
    preloadImage(page: number) {
      if (page > this.data.imageList.length) {
        return
      }

      this.data.imageList[page - 1].loadSrc = this.data.imageList[page - 1].src
      this.setData({
        imageList: this.data.imageList
      })
      preloadQueue.push(() => this.loadRemoteImage(this.data.imageList[page - 1]))
    },


  }
})
