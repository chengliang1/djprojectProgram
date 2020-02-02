var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
   key: '556BZ-JNZKU-X6HVT-4GIXP-XT3HT-7OBBV' // 必填
});

//预约时间选择
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

Page({
   data: {
      username:'',
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
      //计算距离和时间
      distance: '',
      duration: '',
      price: '',
      unit: '',
      show: 'none',
      djtype: 'JH',
      
      //日期选择
      startDate: "日期选择",
      multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
      multiIndex: [0, 0, 0],
      //代驾类型
      items: [
      { name: 'PT', value: '普通代驾' },
      { name: 'JH', value: '酒后代驾', checked: 'true' },
      { name: 'CT', value: '长途代驾' },
       ],
   },

    onLoad: function (res) {
      var that = this;
      var username = res.username;
      that.setData({
        username:username
      })
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
                 // console.log(addressRes)
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
                console.log(res)
                 var ret = res
                 //时间
                 var duration;
                 var duration1 = (res.result.routes[0].duration)

                 if (duration1 < 60){
                    duration = duration1;
                    that.setData({
                     unit: '分钟',
                     duration: duration,
                    })
                 }else{
                    duration = (duration1/60).toFixed(2);
                    that.setData({
                     unit: '小时',
                     duration: duration,
                    })
                 }
                 //距离
                 var distance = ((ret.result.routes[0].distance)/1000).toFixed(2)
                 that.setData({
                    show: '',
                    distance: distance,
                 })
                 //价格计算 暂且不按时间段计算
                 //console.log(that.data.startDate)
                 //console.log(that.data.djtype)
                 var price;
                 if( distance <= 5){
                    price = 25;
                    that.setData({
                       price : price,
                    })
                 }else if( 5 < distance <= 30){
                    price = (25 + (distance-5)*6).toFixed(2);
                    that.setData({
                       price: price
                    })
                 }else if( distance >30){
                    price = (150 + (distance-30)*7).toFixed(2);
                    that.setData({
                       price: price
                    })
                 }
             },
               //终点请求失败
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

   //时间选择器,多列选择 对日期 时间做判断
   pickerTap:function() {
      date = new Date();
  
      var monthDay = ['今天','明天'];
      var hours = [];
      var minute = [];
      
      currentHours = date.getHours();
      currentMinute = date.getMinutes();
  
      // 月-日
      for (var i = 2; i <= 28; i++) {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + i);
        var md = (date1.getMonth() + 1) + "-" + date1.getDate();
        monthDay.push(md);
      }
  
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
  
      if(data.multiIndex[0] === 0) {
        if(data.multiIndex[1] === 0) {
          this.loadData(hours, minute);
        } else {
          this.loadMinute(hours, minute);
        }
      } else {
        this.loadHoursMinute(hours, minute);
      }
  
      data.multiArray[0] = monthDay;
      data.multiArray[1] = hours;
      data.multiArray[2] = minute;
  
      this.setData(data);
    },
  
    bindMultiPickerColumnChange:function(e) {
      date = new Date();
      var that = this; 
      var monthDay = ['今天', '明天'];
      var hours = [];
      var minute = []; 
      currentHours = date.getHours();
      currentMinute = date.getMinutes();
  
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      // 把选择的对应值赋值给 multiIndex
      data.multiIndex[e.detail.column] = e.detail.value;
  
      // 然后再判断当前改变的是哪一列,如果是第1列改变
      if (e.detail.column === 0) {
        // 如果第一列滚动到第一行
        if (e.detail.value === 0) {
  
          that.loadData(hours, minute);
          
        } else {
          that.loadHoursMinute(hours, minute);
        }
  
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
  
        // 如果是第2列改变
      } else if (e.detail.column === 1) {
  
        // 如果第一列为今天
        if (data.multiIndex[0] === 0) {
          if (e.detail.value === 0) {
            that.loadData(hours, minute);
          } else {
            that.loadMinute(hours, minute);
          }
          // 第一列不为今天
        } else {
          that.loadHoursMinute(hours, minute);
        }
        data.multiIndex[2] = 0;
  
        // 如果是第3列改变
      } else {
        // 如果第一列为'今天'
        if (data.multiIndex[0] === 0) {
  
          // 如果第一列为 '今天'并且第二列为当前时间
          if(data.multiIndex[1] === 0) {
            that.loadData(hours, minute);
          } else {
            that.loadMinute(hours, minute);
          }
        } else {
          that.loadHoursMinute(hours, minute);
        }
      }
      data.multiArray[1] = hours;
      data.multiArray[2] = minute;
      this.setData(data);
    },
  
    loadData: function (hours, minute) {
      var minuteIndex;
      if (currentMinute > 0 && currentMinute <= 10) {
        minuteIndex = 10;
      } else if (currentMinute > 10 && currentMinute <= 20) {
        minuteIndex = 20;
      } else if (currentMinute > 20 && currentMinute <= 30) {
        minuteIndex = 30;
      } else if (currentMinute > 30 && currentMinute <= 40) {
        minuteIndex = 40;
      } else if (currentMinute > 40 && currentMinute <= 50) {
        minuteIndex = 50;
      } else {
        minuteIndex = 60;
      }
  
      if (minuteIndex == 60) {
        // 时
        for (var i = currentHours + 1; i < 24; i++) {
          hours.push(i);
        }
        // 分
        for (var i = 0; i < 60; i += 10) {
          minute.push(i);
        }
      } else {
        // 时
        for (var i = currentHours; i < 24; i++) {
          hours.push(i);
        }
        // 分
        for (var i = minuteIndex; i < 60; i += 10) {
          minute.push(i);
        }
      }
    },
  
    loadHoursMinute: function (hours, minute){
      // 时
      for (var i = 0; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    },
  
    loadMinute: function (hours, minute) {
      var minuteIndex;
      if (currentMinute > 0 && currentMinute <= 10) {
        minuteIndex = 10;
      } else if (currentMinute > 10 && currentMinute <= 20) {
        minuteIndex = 20;
      } else if (currentMinute > 20 && currentMinute <= 30) {
        minuteIndex = 30;
      } else if (currentMinute > 30 && currentMinute <= 40) {
        minuteIndex = 40;
      } else if (currentMinute > 40 && currentMinute <= 50) {
        minuteIndex = 50;
      } else {
        minuteIndex = 60;
      }
  
      if (minuteIndex == 60) {
        // 时
        for (var i = currentHours + 1; i < 24; i++) {
          hours.push(i);
        }
      } else {
        // 时
        for (var i = currentHours; i < 24; i++) {
          hours.push(i);
        }
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    },
  
    bindStartMultiPickerChange: function (e) {
      var that = this;
      var monthDay = that.data.multiArray[0][e.detail.value[0]];
      var hours = that.data.multiArray[1][e.detail.value[1]];
      var minute = that.data.multiArray[2][e.detail.value[2]];
  
      if (monthDay === "今天") {
        var month = date.getMonth()+1;
        var day = date.getDate();
        monthDay = month + "月" + day + "日";
      } else if (monthDay === "明天") {
        var date1 = new Date(date);
        date1.setDate(date.getDate() + 1);
        monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
  
      } else {
        var month = monthDay.split("-")[0]; // 返回月
        var day = monthDay.split("-")[1]; // 返回日
        monthDay = month + "月" + day + "日";
      }
  
      var startDate = monthDay + " " + hours + ":" + minute;
      that.setData({
        startDate: startDate
      })
    },
 
    //代驾类型
    radioChange: function (e) {
       var that = this;
       var djtype = e.detail.value
      that.setData({
         djtype: djtype
      })
     // console.log('radio发生change事件，携带value值为：', e.detail.value)
    },
   //呼叫司机
    driving:function(){
       var that = this;
      wx.navigateTo({
        url: '/pages/main/main?srcLat='+that.data.mobileLocation.latitude
        +'&srcLng='+ that.data.mobileLocation.longitude
        +'&dstLat='+ that.data.mobileLocation1.latitude
        +'&dstLng='+ that.data.mobileLocation1.longitude
        +'&username='+ that.data.username
        +'&order_Date='+ that.data.startDate
        +'&djtype='+ that.data.djtype
        +'&orgin='+ that.data.mobileLocation.name
        +'&destination='+ that.data.mobileLocation1.name
        +'&duration='+ that.data.duration
        +'&distance='+ that.data.distance
        +'&unit='+ that.data.unit
        +'&price='+ that.data.price
      })
    },
    //跳到个人信息页面
    person: function () {
       var that = this;
       wx.navigateTo({
         url: '/pages/person/person?username='+that.data.username,
       })
    }
 
});
