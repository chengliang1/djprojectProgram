// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: '556BZ-JNZKU-X6HVT-4GIXP-XT3HT-7OBBV' // 必填
});
Page({
    data: {
        markers:[],
        srcLat: 0,
        srcLng: 0,
        dstLat: 0,
        dstLng: 0,
        latitude: 0,
        longitude: 0,
        licence:'',
        brand:'',
        color:'',
        username:'',
        star:'',
        order:'',
        show: 'none',
    },
    onLoad:function(res) {
        var markers =[{
            id:0,
            iconPath:"../../images/start.png",
            latitude:res.srcLat,
            longitude:res.srcLng,
            width:50,
            height:50
        },
        {
            id:1,
            iconPath:"../../images/end.png",
            latitude:res.dstLat,
            longitude:res.dstLng,
            width:50,
            height:50
        }]
        this.setData({
            markers:markers,
            srcLat: res.srcLat,
            srcLng: res.srcLng,
            dstLat: res.dstLat,
            dstLng: res.dstLng,
            latitude: res.srcLat,
            longitude: res.srcLng
        });
        var _this = this;
        wx.request({
          url: 'http://127.0.0.1:8081/driverinformation/drivers/getWork',
          method:'GET',
          success:function(res){
            console.log(JSON.stringify(res.data.data))
            if(res.data.data != null){
                _this.setData({
                    show: '',
                    licence:res.data.data.licence,
                    brand:res.data.data.car_brand,
                    color:res.data.data.car_color,
                    username:res.data.data.username,
                    star:res.data.data.driver_star,
                    order:res.data.data.order_num,
                })
            }else{
                wx.showToast({
                  title: '附近暂无司机，请等待',
                  duration:6000,
                })
            }
            
          }
        });
        
        //调用距离计算接口
        qqmapsdk.direction({
            mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
              //from参数不填默认当前地址
          from: {
              latitude: _this.data.srcLat,
              longitude: _this.data.srcLng
          },
          to: {
              latitude: _this.data.dstLat,
              longitude: _this.data.dstLng
          }, 
          success: function (res) {
              var ret = res
              //console.log(res.result.routes[0].distance)
              //公里
              var distance = (ret.result.routes[0].distance)/1000
              console.log(distance)
              var coors = ret.result.routes[0].polyline, pl = [];
              //坐标解压（返回的点串坐标，通过前向差分进行压缩）
              var kr = 1000000;
              for (var i = 2; i < coors.length; i++) {
                  coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
              }
              //将解压后的坐标放入点串数组pl中
              for (var i = 0; i < coors.length; i += 2) {
                  pl.push({ latitude: coors[i], longitude: coors[i + 1] })
              }
              console.log(pl)
              //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
              _this.setData({
                  latitude:pl[0].latitude,
                  longitude:pl[0].longitude,
                  polyline: [{
                      points: pl,
                      //color: '#FF0000DD',
                      color:'#3299CC',
                      width: 5,
                      borderWidth:5,
                      arrowLine:true,
                      dottedLine:true,

                  }]
               })
          },
          fail: function (error) {
              console.error(error);
          },
          complete: function (res) {
              console.log(res);
           }
       });

        
    },

    //进入付款页面
    payment:function(){
        var that = this
        wx.navigateTo({
          url: '/pages/payment/payment',
        })
    }
})    