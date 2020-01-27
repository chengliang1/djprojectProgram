var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
   key: '556BZ-JNZKU-X6HVT-4GIXP-XT3HT-7OBBV' // 必填
});

Page({
   data: {
      latitude : 0,
      longitude: 0,
      markers: [],
      mobileLocation : {//移动选择起点位置数据
         name: '',
         longitude : 0,
         latitude: 0,
      },
      mobileLocation1 : {//移动选择终点位置数据
         name: '',
         longitude : 0,
         latitude: 0,
      },
      distance: '',
      show: 'none'
      
   },
    onLoad: function () {
      var that = this;
      this.mapCtx = wx.createMapContext('qqMap');
      //获取位置
      wx.getLocation({
         type: 'gcj02',//默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
         success: function(res) {
            //逆地址解析
            qqmapsdk.reverseGeocoder({
               location: {
                  latitude: res.latitude,
                  longitude: res.longitude
               },
               success: function(addressRes){
                  console.log(addressRes)
               let mobileLocation = {
                  latitude: res.latitude,
                  longitude: res.longitude,
                  name: addressRes.result.formatted_addresses.recommend,
               };
               var markers = [{
                  iconPath:"../../images/start.png",
                  latitude: res.latitude,
                  longitude: res.longitude,
                  width:50,
                  height:50
               }]
               that.setData({
                  mobileLocation: mobileLocation,
                  markers: markers,
                  latitude:res.latitude,
                  longitude: res.longitude
               });
            } 
         })
      }
   })
},
    //选起点
   moveToLocation: function () {
      var that = this;
      wx.chooseLocation({
         success: function (res) {
            let mobileLocation = {
               longitude: res.longitude,
               latitude: res.latitude,
               name: res.name,
            };
            var markers = [{
               iconPath:"../../images/start.png",
               latitude: res.latitude,
               longitude: res.longitude,
               width:50,
               height:50
            }]
            that.setData({
               markers:markers,
               longitude: res.longitude,
               latitude: res.latitude,
               mobileLocation: mobileLocation,
            });
           
         },
         fail: function (err) {
            console.log(err)
         }
      });
      that.mapCtx.moveToLocation();
   },

   //选终点
   moveToLocation1: function () {
      var that = this;
      wx.chooseLocation({
         success: function (res) {
            let mobileLocation1 = {
               longitude: res.longitude,
               latitude: res.latitude,
               name: res.name,
            };
            var markers = [{
                  iconPath:"../../images/end.png",
                  latitude: res.latitude,
                  longitude: res.longitude,
                  width:50,
                  height:50
            }]
            that.setData({
               mobileLocation1: mobileLocation1,
               markers: markers
            });
            //计算距离和时间
            qqmapsdk.direction({
               mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
                 //from参数不填默认当前地址
             from: {
                 latitude: that.data.mobileLocation.latitude,
                 longitude: that.data.mobileLocation.longitude
             },
             to: {
                 latitude: that.data.mobileLocation1.latitude,
                 longitude: that.data.mobileLocation1.longitude
             }, 
             success: function (res) {
                 var ret = res
                 //console.log(res.result.routes[0].distance)
                 //公里
                 var distance = (ret.result.routes[0].distance)/1000
                 that.setData({
                    show: '',
                    distance: distance,

                 })
                 console.log(distance)
             },
               fail: function (error) {
                 console.error(error);
             },
               complete: function (res) {
                  console.log(res);
              }
          });
         },
         fail: function (err) {
            console.log(err)
         }
      });
     
   },
   //移动地图中心点选起点
   mapChange: function (e) {
       // 实例化API核心类
       qqmapsdk = new QQMapWX({
         key: '556BZ-JNZKU-X6HVT-4GIXP-XT3HT-7OBBV'
      });
     var that = this;
     this.mapCtx = wx.createMapContext('qqMap');
      //console.log(e);
      if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')){
         that.mapCtx.getCenterLocation({
            success: function (res) {
            //逆地址解析
            qqmapsdk.reverseGeocoder({
               location: {
                  latitude: res.latitude,
                  longitude: res.longitude
               },
               success: function(addressRes){
               let mobileLocation = {
                  latitude: res.latitude,
                  longitude: res.longitude,
                  name: addressRes.result.formatted_addresses.recommend,
               };
               var markers = [{
                     iconPath:"../../images/start.png",
                     latitude: res.latitude,
                     longitude: res.longitude,
                     width:50,
                     height:50
               }]
               that.setData({
                  latitude: res.latitude,
                  longitude: res.longitude,
                  markers: markers,
                  mobileLocation: mobileLocation,
               });
            }
         });
         }
      })
      that.mapCtx.moveToLocation();
   }
},

//呼叫司机
    driving:function(){
       var that = this;
      wx.navigateTo({
        url: '/pages/main/main?srcLat='+that.data.mobileLocation.latitude
        +'&srcLng='+ that.data.mobileLocation.longitude
        +'&dstLat='+ that.data.mobileLocation1.latitude
        +'&dstLng='+ that.data.mobileLocation1.longitude,
      })
    },
 
});
