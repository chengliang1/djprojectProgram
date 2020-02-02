Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
  },
  formSubmit: function (e) {
    var that = this
    var username = e.detail.value.username;
    var password = e.detail.value.password;
    that.setData({
      username: username,
      password: password
    })
    wx.request({
      url: 'http://127.0.0.1:8081/smallprogram',
      method:"POST",
      data: {
        username: e.detail.value.username,
        password: e.detail.value.password
      },
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var resData = res.data;
        if (resData == true) {
          //访问正常
          wx.showToast({
            title: '登录成功',
            icon:'loading',
            duration: 3000,
            success:function(){
              wx.redirectTo({
                duration:4000,
                url: '/pages/order/order?username='+that.data.username
              })
              }
          })
        }else{
          wx.showToast({
            icon:"none",
            title: '用户名或密码不正确',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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