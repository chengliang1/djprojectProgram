var app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    //司机信息
    drivername: '',
    licence: '',
    star: 0,
    order: '',
    price: '',
    two_1:'',

    //评价信息
    orderid: '',
    one_2: 0,
    two_2: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
  var that = this
  var orderid = res.orderid
  var drivername = res.drivername
  var licence = res.licence
  var star = res.star
  var order = res.order
  var price = res.price
  var username = res.username
   that.setData({
    orderid: orderid,
    drivername: drivername,
    licence: licence,
    star: star-0,
    order: order,
    price: price,
    username: username
   })
   that.setData({
     two_1: 5 - that.data.star
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

  //将评价传递到后台
  anony: function (res) {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8081/orderinformation/orders/evaluate',
      method: "GET",
      data: {
        orderid:that.data.orderid,
        evaluatestar: that.data.one_2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var resData = res.data;
        if (resData == true) {
          //访问正常
          wx.showToast({
            title: '感谢您的选择',
            icon:'loading',
            duration: 8000,
            success:function(){
             wx.navigateTo({
               url: '/pages/order/order?username='+that.data.username
             })
            }
          })
        }else{
          wx.showToast({
            icon:"none",
            title: '评价失败',
            duration: 3000,
          })
        }
      },
      error:function(res){
        console.log("error"+res)
      }
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