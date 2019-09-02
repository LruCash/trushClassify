var util = require('../../utils/util.js')
var input = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindSource: [],
    hiddenscroll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  search: function () {
    this.searchkeyWords(input);
  },

  /**监听键盘输入时间 */
  bindinput: function(event) {
    input = event.detail.value
    this.searchkeyWords(input)
  },

  searchkeyWords(prefix){
    let page = this;
    if (prefix != "") {
      wx.request({
        url: 'https://api.tianapi.com/txapi/lajifenlei/',
        data: {
          key: '88ee40d3728440a73c64a591cb87fcd7',
          word: prefix
        },
        success: function (res) {
          let datalist = res.data.newslist;
          console.log(datalist);
          if (res.data.code == 200) {
            page.setData({
              hiddenscroll: false,
              bindSource: datalist,
            })
          } else {
            /**下拉联想失败*/
          }
        }
      })
    } else {
      /**input清空 */
      page.setData({
        hiddenscroll: true,
      })
    }
  },

  /**下拉联想item点击 */
  itemClick: function(event) {
    var clickIndex = event.currentTarget.dataset.itemindex;
    var that = this;
    var data = JSON.stringify(that.data.bindSource[clickIndex]);
    wx.navigateTo({
      url: '../searchDetail/searchDetail?data='+data,

    })
  }

})