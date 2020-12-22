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
    },
    imageData: {
      type: Array
    },
    playPages: {
      type: Array
    }
  },
  data: {
    position: {
      page: 0
    } as ContentPosition,
    imageList: [] as Array<ImgItem>,
    isFullscreen: false,
    isEncrypted: true,
    width: 0,
    height: 0,
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
    showToc: false
  },
  lifetimes: {
    attached() {
      this._init()
      this.resize()
      this.setData({
        toc: this.reBuildToc()
      })
    }
  },
  methods: {
    handlePage(e) {
      console.log(e)
      this.goto({page: e.currentTarget.dataset.page})
    },
    reBuildToc() {
      const list = []
      const toc = this.data.toc
      toc.forEach(item => {
        list.push({title: item.title, key: item.key, type: 'part'})
        if (item.children.length) {
          item.children.forEach(item2 => {
            list.push({title: item2.title, key: item2.key, type: 'chapter'})
            if (item2.children.length) {
              item2.children.forEach(item3 => {
                list.push({title: item3.title, key: item3.key, type: 'unit'})
              })
            }
          })
        }
      })
      return list
    },
    toggleToc() {
      this.setData({
        showToc: !this.data.showToc
      })
    },
    resize() {
      const that = this
      const query = this.createSelectorQuery()
      query.select('.pages').boundingClientRect()
      query.exec(function (res) {
        that.setData({
          width: res[0].width,
          height: res[0].height
        })
      })
    },
    _init() {
      if (this.properties.imageData.length) {
        this._initNoEncryptData()
      } else {
        this._initEncryptData()
      }
      if (this.properties.defaultPosition) {
        this.goto(this.properties.defaultPosition)
      } else {
        this.goto({page: 1})
      }
    },
    onFullScreen() {
      this.setData({
        isFullscreen: !this.data.isFullscreen
      })
      this.resize()
    },
    _initEncryptData() {
      const list = []
      if (this.properties.playPages.length) {
        this.properties.playPages.forEach((item, index) => {
          const img = {
            src: this.properties.imageUrlPrefix + item,
            page: (index + 1),
            active: false,
            load: false
          } as ImgItem
          list.push(img)
        })
      } else {
        for (let i = 1; i <= this.properties.totalPage; i++) {
          const img = {
            src: this.properties.imageUrlPrefix + i,
            page: i,
            active: false,
            load: false
          } as ImgItem
          list.push(img)
        }
      }

      this.setData({
        imageList: list,
        isEncrypted: true
      })
    },
    _initNoEncryptData() {
      const list = []
      for (let i = 0; i < this.properties.imageData.length; i++) {
        const img = {
          src: this.properties.imageData[i],
          page: (i + 1),
          active: false,
          load: false
        } as ImgItem
        list.push(img)
      }
      this.setData({
        imageList: list,
        isEncrypted: false
      })
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
          if (that.data.isEncrypted) {
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
          } else {
            image.base64 = 'data:image/png;base64,' + wx.arrayBufferToBase64(data)
            image.load = true
            const currentIndex = image.page - 1
            that.setData({
              ['imageList[' + currentIndex + ']']: image,
            })
          }
        }
      })
    },
    prev() {
      this.goto({page: this.data.position.page - 1})
    },

    next() {
      this.goto({page: this.data.position.page + 1})
    },
    goFirst() {
      this.goto({page: 1})
    },
    goLast() {
      this.goto({page: this.data.totalPage})
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
      this.triggerEvent('page-change', {page})
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
        const currentIndex = newActiveImg.page - 1
        this.setData({
          ['imageList[' + currentIndex + ']']: newActiveImg
        })
        if (!newActiveImg.load) {
          this._loadImage(newActiveImg)
        }
      }
    }
  }
})
