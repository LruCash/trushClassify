Page({

  /**
   * 页面的初始数据
   */
  data: {
    trushType: '可回收物',
    trushName: '',
    throwTip: '',
    list_content: '',
    trushImage:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    let data = JSON.parse(option.data);
    let dic = { 0: '可回收物', 1:'有害垃圾',2:'湿垃圾',3:'干垃圾'}
    let imageDic = {
      0: '../../icon/trush/recycle_icon.jpeg', 1:'../../icon/trush/harmful_icon.jpeg',
      2: '../../icon/trush/wet_icon.jpeg', 3:'../../icon/trush/dry_icon.jpeg'}
    this.setData({
      trushName: data.name,
      throwTip: data.tip,
      list_content: data.contain,
      trushType: dic[data.type],
      trushImage: imageDic[data.type]
    })
  },
})