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
        show: 'none',
        //司机信息
        id:'',
        name:'',
        drivername:'',
        licence:'',
        brand:'',
        color:'',
        star:'',
        order:'',
        //订单信息
        username:'',
        order_Date:'',
        djtype: '',
        orgin: '',
        destination: '',
        distance: 0,
        duration: 0,
        unit: '',
        price: 0,

    },
    onLoad:function(res) {
        var username = res.username
        var order_Date = res.order_Date
        var djtype = res.djtype
        var orgin = res.orgin
        var destination = res.destination
        var distance = res.distance
        var duration = res.duration
        var unit = res.unit
        var price = res.price
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
            longitude: res.srcLng,
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
        });
        var _this = this;
        wx.request({
          url: 'http://127.0.0.1:8081/driverinformation/drivers/getWork',
          method:'GET',
          success:function(res){
           // console.log(JSON.stringify(res.data.data))
            if(res.data.data != null){
                _this.setData({
                    show: '',
                    id:res.data.data.id,
                    licence:res.data.data.licence,
                    brand:res.data.data.car_brand,
                    color:res.data.data.car_color,
                    drivername:res.data.data.drivername,
                    name:res.data.data.name,
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
        
        //调用距离计算接口形成路线
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
             //console.log(pl)
              //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
              _this.setData({
                  latitude:pl[0].latitude,
                  longitude:pl[0].longitude,
                  polyline: [{
                      points: pl,
                      //color: '#FF0000DD',
                      color:'#1ab639',
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
             // console.log(res);
           }
       });

        
    },

    //取消订单
    cancel:function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '3分钟内可免费取消',
            success: function(res){
            if (res.confirm) {
                wx.request({
                    url: 'http://127.0.0.1:8081/orderinformation/orders/cancel',
                    method:'GET',
                    data: {
                        id: that.data.id
                    },
                    success:function (res) {
                        var resData = res.data;
                        if(resData == true){
                            wx.navigateTo({
                                url: '/pages/order/order?username='+that.data.username
                            })
                        }
                }
            })
            } else if (res.cancel) {
            }
        }
        })   
    },

    //进入付款页面
    payment:function(){
        var that = this
            wx.navigateTo({
                url: '/pages/payment/payment?drivername='+that.data.drivername
                +'&id='+ that.data.id
                +'&name='+ that.data.name
                +'&username='+ that.data.username
                +'&licence='+ that.data.licence
                +'&brand='+ that.data.brand
                +'&color='+ that.data.color
                +'&star='+ that.data.star
                +'&order='+ that.data.order
                //订单信息
                +'&order_Date='+ that.data.order_Date
                +'&djtype='+ that.data.djtype
                +'&orgin='+ that.data.orgin
                +'&destination='+ that.data.destination
                +'&distance='+ that.data.distance
                +'&duration='+ that.data.duration
                +'&unit='+ that.data.unit
                +'&price='+ that.data.price
              })
        
    }
})    