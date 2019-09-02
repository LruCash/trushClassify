//index.js
const crypto = requirePlugin("crypto");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    wetTrush: [],
    dryTrush: [],
    recycleTrush: [],
    harmfulTrush: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initTrushData(),
      this.getSystemHeight();
  },

  /**初始化页面数据 */
  initTrushData() {
    var app = getApp();
    this.setData({
      wetTrush: app.globalData.wetTrush,
      dryTrush: app.globalData.dryTrush,
      recycleTrush: app.globalData.recycleTrush,
      harmfulTrush: app.globalData.harmfulTrush,
    })
  },

  /**获取屏幕高度 */
  getSystemHeight() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
        });
      }
    });
  },

  /** 左侧tab栏点击*/
  leftTab: function(event) {
    this.setData({
      clicktab: event.target.dataset.clicktab
    })
    console.log('afterData_' + this.data.clicktab)
  },

  /**点击tab切换swiper */
  tabClick: function(event) {
    console.log("click_" + event.target.dataset.tab_index);
    if (this.data.swiperIndex !== event.target.dataset.tab_index) {
      this.setData({
        swiperIndex: event.target.dataset.tab_index
      })
    }
  },

  /**点击跳转搜索界面 */
  searchTap: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  tabChange: function(event) {
    this.setData({
      swiperIndex: event.detail.current,
    })
  },


  //获取base64图片
  getBase64Image() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          success: res => {
            that.getAccessToken(decodeURI(res.data))
          }
        })
      },
    })
  },

  //获取百度AI accessToken
  getAccessToken(base64) {
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method: 'GET',
      data: {
        grant_type: 'client_credentials',
        client_id: 'bZmmpOouEGLc11EajqhYLgSQ',
        client_secret: 'BmedmgCyL44tsmoHT2UpzTDQLn14AvZW',
      },
      success: res => {
        that.getPhotoData(res.data.access_token, base64);
      }

    })
  },


  getPhotoData(token, base64) {
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + token,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        image: base64,
      },
      success(res) {
        console.log(res);
        if (res.statusCode == 200 && res.data.result.length > 0) {
          let keyword = res.data.result[0].keyword;
          that.getTrushInfo(keyword);
        } else {
          that.recPhotoFail();
        }
      },
      fail(res) {
        that.recPhotoFail();
      }
    })
  },

  getTrushInfo(keywords) {
    var that = this;
    wx.request({
      url: 'https://api.tianapi.com/txapi/lajifenlei/',
      data: {
        key: '88ee40d3728440a73c64a591cb87fcd7',
        word: keywords
      },
      success: function(res) {
        let datalist = res.data.newslist;
        console.log(datalist);
        if (res.data.code == 200) {
          let data = JSON.stringify(datalist[0]);
          wx.navigateTo({
            url: '../searchDetail/searchDetail?data=' + data,
          })
        }else{
          that.searchPhotoFail();
        }
      }
    })
  },

  //失败toast
  recPhotoFail() {
    wx.showToast({
      title: '图像识别失败...',
      icon: 'fail',
      duration: 1000
    })
  },

  searchPhotoFail() {
    wx.showToast({
      title: '查询失败...',
      icon: 'succ',
      duration: 1000
    })
  },
})