var app = getApp()
var count = 0;
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    num: 4,//后端给的分数,显示相应的星星
    one_1: '',
    two_1: '',
    one_2: 0,
    two_2: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      one_1: this.data.num,
      two_1: 5 - this.data.num
    })
  },
 //情况二:用户给评分
 in_xin:function(e){
  var in_xin = e.currentTarget.dataset.in;
  var one_2;
  if (in_xin === 'use_sc2'){
    one_2 = Number(e.currentTarget.id);
  } else {
    one_2 = Number(e.currentTarget.id) + this.data.one_2;
  }
  this.setData({
    one_2: one_2,
    two_2: 5 - one_2
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})