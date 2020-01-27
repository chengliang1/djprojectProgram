//index.js
//获取应用实例
var QQMapWX = require('../../libs/qqmap-wx-jssdk')
var qqmapsdk = new QQMapWX({
    key: '556BZ-JNZKU-X6HVT-4GIXP-XT3HT-7OBBV' // 必填
})
const app = getApp()

Page({
  data: {
    name: wx.getStorageSync('address_component')
  },
  onLoad: function () {
    var self=this;
    this.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: 'true',
      success(res) {
        wx.setStorageSync('latitude', res.latitude)
        wx.setStorageSync('longitude', res.longitude)
        console.log('纬度',res.latitude,'经度',res.longitude)
        
        self.setData({
          latitude : res.latitude,
          longitude : res.longitude,
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            
            iconPath: '../../images/icpostion.png',
            width:40,
            height:40,
          }],
        });
        console.log(res);
      },
      //逆地址解析
      complete(){
        qqmapsdk.reverseGeocoder({
              // 位置坐标，默认获取当前位置，非必须参数
              location: {
                latitude: wx.getStorageSync('latitude'),
                longitude: wx.getStorageSync('longitude')
              },
              success: function (res) {
                console.log(res.result.address_component.street)
                wx.setStorageSync('address_component',res.result.address_component.street)
              },
            fail: function (error) {
              console.error('错误', error)
            }
          })
        },
      
      })
    },

    onReady: function(){
      this.mapCtx = wx.createMapContext('myMap')
      wx.onLocationChange(function(res) {
        console.log('location change', res)
       })
    }
})
  
