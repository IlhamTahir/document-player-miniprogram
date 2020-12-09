// eslint-disable-next-line import/extensions
import {Decrypter} from './aes-decrypter.js'

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
    }
  },
  data: {
    position: {
      page: 0
    } as ContentPosition,
    imageList: [] as Array<ImgItem>,
    isFullscreen: false,
    loadImg: 'http://storage.360buyimg.com/mtd/home/lion1483624894660.jpg',
    base64: null
  },
  lifetimes: {
    attached() {
      this.init()
    }
  },
  methods: {
    init() {
      const list = []
      for (let i = 1; i <= this.properties.totalPage; i++) {
        const img = {
          src: this.properties.imageUrlPrefix + i,
          page: i,
          active: false,
          load: false
        } as ImgItem
        list.push(img)
      }
      this.setData({
        imageList: list
      })

      if (this.properties.defaultPosition) {
        this.goto(this.properties.defaultPosition)
      } else {
        this.goto({page: 1})
      }
    },
    _str2uint32(str: string) {
      const l = str.length
      const array = new Uint8Array(l)
      for (let i = 0; i < l; i++) {
        array[i] = str[i].charCodeAt(0)
      }
      return new Uint32Array(array.buffer)
    },
    _loadImage(image) {
      let data
      const that = this
      wx.request({
        url: image.src,
        responseType: 'arraybuffer',
        success: result => {
          data = result.data
          const key = that._str2uint32(this.properties.encryptKey)
          const iv = that._str2uint32(this.properties.encryptIv)

          const readerBuffer = new Uint8Array(data)
          // eslint-disable-next-line handle-callback-err,no-new
          new Decrypter(readerBuffer, key, iv, (err, decryptedArray) => {
            image.base64 = 'data:image/png;base64,' + wx.arrayBufferToBase64(decryptedArray.buffer)
            image.load = true
            const currentIndex = image.page - 1
            that.setData({
              ['imageList[' + currentIndex + ']']: image,
            })
          })
        }
      })
    },
    prev() {
      this.goto({page: this.data.position.page - 1})
    },

    next() {
      this.goto({page: this.data.position.page + 1})
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

      this.setData({
        position: {page}
      })
      let oldActiveImg: ImgItem | undefined
      let newActiveImg: ImgItem | undefined

      for (const img of this.data.imageList) {
        if (img.active) {
          oldActiveImg = img
        }

        if (img.page === page) {
          newActiveImg = img
        }
      }

      if (oldActiveImg && newActiveImg && oldActiveImg.page === newActiveImg.page) {
        return
      }

      if (oldActiveImg) {
        oldActiveImg.active = false
        const currentIndex = oldActiveImg.page - 1
        this.setData({
          ['imageList[' + currentIndex + ']']: oldActiveImg,
        })
      }


      if (newActiveImg) {
        newActiveImg.active = true
        if (!newActiveImg.load) {
          this._loadImage(newActiveImg)
        } else {
          const currentIndex = newActiveImg.page - 1
          this.setData({
            ['imageList[' + currentIndex + ']']: newActiveImg
          })
        }
      }
    }
  }
})
