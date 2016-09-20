function openMap(options){
	this.options = {
		share:'shareplace'
	}
	this.mapinit();
	this.cityService();
}
openMap.prototype ={
	init:function(callback){
		this.callback = callback;
		this.iupdate();
		// this.share();
	},
	$:function(id){
		return document.getElementById(id);
	},
	mapinit:function(){  //建立一张地图
		var otherJS = 'http://map.qq.com/api/js?v=2.exp&key=PILBZ-QBV35-T3ZI3-QZP5X-WUV2F-27F3J';//js的地址，请自定义
		var newscript = document.createElement('script');
		newscript.src = otherJS;
		document.getElementsByTagName('body')[0].appendChild(newscript);
		var that = this;
		var map = new qq.maps.Map(
		that.$('mpcontainer'),
		{
			zoom:13,
			center:new qq.maps.LatLng(39.916527,116.397128)	//默认地址
		});
		this.map = map;
	},
	cityService:function(){  //地图上的定位
		var that = this;
		this.citylocation = new qq.maps.CityService({
			map:that.map,
	        complete : function(results){
	            that.map.setCenter(results.detail.latLng);
	            // if (marker != null) {
	            //     marker.setMap(null);
	            // }
	            //设置marker标记
	            // that.setOtherLoc(results.detail,true);
	        }
	    });
	},
	iupdate:function(){  //更新位置
		var that = this;
		var geolocation = new qq.maps.Geolocation("PILBZ-QBV35-T3ZI3-QZP5X-WUV2F-27F3J", "whofirsthome");
		geolocation.getLocation(function(loc){
			console.log(loc);
			var latLng = new qq.maps.LatLng(loc.lat, loc.lng);
          	that.citylocation.searchCityByLatLng(latLng);
          	that.$("showposition").innerHTML = loc.addr;
          	// that.loc = loc;
          	that.callback(loc);
		},function(){
			that.$("showposition").innerHTML = "定位失败";
		},{timeout:8000});
	},
	update:function(){	//不用
		var isMapInit = false;
		var loc;
		var that = this;
		window.addEventListener('message',function(event){
			this.location = loc = event.data;
			console.log(loc);
		if(loc  && loc.module == 'geolocation') { //定位成功,防止其他应用也会向该页面post信息，需判断module是否为'geolocation'
          		var latLng = new qq.maps.LatLng(loc.lat, loc.lng);
          		that.citylocation.searchCityByLatLng(latLng);
            } else { //定位组件在定位失败后，也会触发message, event.data为null
                alert('定位失败'); 
            }

        }, false);
        //为防止定位组件在message事件监听前已经触发定位成功事件，在此处显示请求一次位置信息
        document.getElementById("getpos").contentWindow.postMessage('getLocation', '*');
         
        //设置6s超时，防止定位组件长时间获取位置信息未响应
        setTimeout(function() {
            if(!loc) {
                //主动与前端定位组件通信（可选），获取粗糙的IP定位结果
            document.getElementById("getpos")
                .contentWindow.postMessage('getLocation.robust', '*');
            }
        }, 6000);

        //设置位置改变监听
        // document.getElementById("getpos").contentWindow.postMessage('watchPosition', '*');
	},
	//设置marker标记
	setOtherLoc:function(loc,opt){
		if(!loc) return;
		var that = this;
		var latLng = loc.latLng?loc.latLng:(new qq.maps.LatLng(loc.lat, loc.lng));
		var marker = new qq.maps.Marker({
	                map: that.map,
	                position: latLng
	            });
		var anchor = new qq.maps.Point(12, 12),
          	size = new qq.maps.Size(24, 24),
          	origin = new qq.maps.Point(0, 0);
        var url = '../center.gif';
        // if(opt) url = '../center.gif';
        // else url = '../pos.png';
	    var markerIcon = new qq.maps.MarkerImage(url,size, origin,anchor);
	    marker.setIcon(markerIcon);
	},
	share:function(){
		var _share = this.$(this.options.share);
		_share.addEventListener('touchstart',function(event){
			// this.location.lat
		},false);
	}
}
// module.exports.openMap = openMap;