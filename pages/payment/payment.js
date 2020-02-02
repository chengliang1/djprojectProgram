// pages/payment/payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //司机信息
    drivername: '',
    licence: '',
    brand: '',
    star: 0,
    order: '',
    num: 2,
    two_1: 0,
    //订单信息
    username: '',
    order_Date:'',
    djtype: '',
    orgin: '',
    destination: '',
    distance: 0,
    duration: 0,
    unit: '',
    price: 0,
    //支付方式
    checked1: false,
    checked2: false,
    checked3: false,
    items1: [
      { name: 'WX', value: '微信支付'},
    ],
    items2: [
      { name: 'ZFB', value: '支付宝支付' },
    ],
    items3: [
      { name: 'QQ', value: 'QQ钱包支付' },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    console.log(res)
    var that = this
    //司机信息
    var id = res.id
    var name = res.name
    var drivername = res.drivername
    var licence = res.licence
    var brand = res.brand
    var star = res.star
    var order = res.order
    //订单信息
    var username =res.username
    var order_Date = res.order_Date
    var djtype = res.djtype
    var orgin = res.orgin
    var destination = res.destination
    var distance = res.distance
    var duration = res.duration
    var unit = res.unit
    var price = res.price
    
    that.setData({
      id: id,
      name: name,
      drivername: drivername,
      licence: licence,
      brand: brand,
      star: star - 0,
      order:order,
      //订单信息
      username: username,
      order_Date: order_Date,
      djtype: djtype,
      orgin: orgin,
      destination: destination,
      distance: distance,
      duration: duration,
      unit: unit,
      price: price
    })
    that.setData({
      two_1: 5 - that.data.star
    })
   
  },

  //支付方式是否选中
  checkedTap1: function () {
    var that = this
    var checked = that.data.checked1;
    this.setData({
      checked1: !checked
    })
  },
  checkedTap2: function () {
    var that = this
    var checked = that.data.checked2;
    this.setData({
      checked2: !checked
    })
  },

  checkedTap3: function () {
    var that = this
    var checked = that.data.checked3;
    this.setData({
      checked3: !checked
    })
  },

  //支付
  payment:function (res) {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8081/orderinformation/orders/orderSave',
      method: "GET",
      data: {
        id:that.data.id,
        name: that.data.name,
        username: that.data.username,
        order_date: that.data.order_Date,
        order_type: that.data.djtype,
        origin: that.data.orgin,
        destination:that.data.destination,
        distance: that.data.distance,
        duration: that.data.duration,
        unit: that.data.unit,
        order_price: that.data.price
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var resData = res.data;
        if (resData == true) {
          //访问正常
          wx.showToast({
            title: '支付成功',
            icon:'loading',
            duration: 4000,
            success:function(){
              wx.redirectTo({
                duration:5000,
                url: '/pages/evaluate/evaluate?username='+that.data.username
              })
              }
          })
        }else{
          wx.showToast({
            icon:"none",
            title: '支付失败',
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