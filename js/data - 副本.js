var host = 'http://bridgematch.ourgame.com';


function parseHash(){
	var _hash = window.location.hash;
	_hash = _hash.substr(1);
	return _hash.split('-');
}

function setHash(h){
	window.location.hash = h;
}



var zhuanti_name = '2015WBTC';//zhuanti.toUpperCase();//'2015WBTC';

var qpzhuanti = angular.module('qpzhuanti',  [], function ($compileProvider) {
	
	
	//解决 ie7 链接为"#"时  unsafe: 问题
  $compileProvider.urlSanitizationWhitelist(/^\s*((https?|ftp|mailto|file|chrome-extension|tel):)|#||javascript:;/);

});//.config(function($sceProvider){$sceProvider.enable(false)});  



function getUrl(controller){
	
	//return host + "/zhuanti/admin/zhuanti_"+controller+"_in.htm?callback=JSON_CALLBACK&zhuanti="+zhuanti_name;
	return host + "/zhuanti/admin/zhuanti_"+controller+"_in.htm?callbacktemp=JSON_CALLBACK&zhuantitemp="+zhuanti_name+"&date="+Date.parse(new Date());
}

var commonController = function(Cname , callback1 , callback2){
	
	qpzhuanti.controller(Cname,['$scope','$http', function ($scope,$http) {  
		 
		 var ng = {scope : $scope};
		 
		 $http.jsonp(getUrl(Cname))
		    .success(
		        function(data){
		        	
		        	callback1(ng,data);
		        	
		            //$scope.list = data;
		            //console.log(data)
		        }
		    )
		    .error(
		        function(data){
		        	
		        	if(callback2)
		        		callback2(ng,data);
		        	else{}
		            	//alert("error");
		        }
		    );
	  
	
	}]);
	
	
};
function contains(arr, obj) {  
    var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
}  

qpzhuanti.controller('_main', function ($scope) {
		
		//控制中间区域的显示
		$scope.show = {
			_index : {display:'block'},
			_newsList : {display:'none'},
			_newsDet : {display:'none'},
			_imgList : {display:'none'},
			_imgDet : {display:'none'},
			_matchDet : {display:'none'}
		};
		//导航选中
		$scope.nav = {
			_index : 'sel',
			_newsList : '',
			_imgList : '',
			_matchDet : ''
		};
		
		
		  $scope.showCenter = function(name){
		  	
		  	var items = ['_index','_matchDet','_newsList','_imgList','_newsDet','_imgDet'];
		  	
		  	if(!contains(items,name)){
		  		name = '_index';
		  	}
		  	
		  	alert(name)
		  	//中间显示
		  	for(var i in $scope.show)
		  		$scope.show[i] = {display:'none'};
		  	$scope.show[name] = {display:'block'};
		  	
		  	
		  	//nav
		  	for(var i in $scope.nav)
		  		$scope.nav[i] = '';
		  		
		  	if(name == '_newsDet')name = '_newsList';
		  	if(name == '_imgDet')name = '_imgList';
		  		
		  	$scope.nav[name] = 'sel';
		  	//alert($scope.show._index)
		  	setHash(name);
		  };
		  
		  
		  //新闻列表来的消息

  
		     $scope.showNewsById = function (msg) {
				
				if(!msg)return false;
				
		         $scope.$broadcast("from_main_to_getNewsDetail", msg);
		         //$scope.$emit("from_center_to_getNewsDetail", msg);
		        
		         $scope.showCenter('_newsDet');
		   	};
		  
		  
		  $scope.to_getJingCaiTuJiDetail = function(msg){
		  	if(!msg)return false;
		  	
		  	$scope.$broadcast("from_main_to_getJingCaiTuJiDetail", msg);
		  	$scope.showCenter('_imgDet');
		  	
		  };
		  
		  
		/**  
		//加载hash内容
		setTimeout(function(){
			
			var _hash = parseHash();
			switch(_hash[0]){
				
				case '_newsDet':{
					//$scope.showCenter('_newsDet');
					$scope.showNewsById(_hash[1]);
					break;
				}
				case '_imgDet':{
					//$scope.showCenter('_imgDet');
					$scope.to_getJingCaiTuJiDetail(_hash[1]);
					break;
				}
				
				default:$scope.showCenter(_hash[0]);
			}
			
		},0);
		**/
		  
	
	});
/****/

//图集详情
qpzhuanti.controller('getJingCaiTuJiDetail', function ($scope,$http) {
		
		
		  //新闻列表来的消息
		  $scope.$on("from_main_to_getJingCaiTuJiDetail",
  
		     function (event, msg) {
		         
		         //请求新闻详情
		         
		         $http.jsonp(getUrl('getJingCaiTuJiDetail')+'&newsIdtemp='+msg)
				    .success(
				        function(data){
				        	
				        	if(data.length <= 0){
				        		alert("请求的内容没有找到...");
				            	event.targetScope.showCenter('_imgList');
				            	return false;
				        	}
				        	
				        	$scope.list = data;
				        	$scope.content = data[0].content.replace(/iframe/g,'');
				        	
				        	//console.log($scope.content.replace('iframe',''))
				        	setTimeout(imgShowInit,10);
				        	setHash('_imgDet-'+data[0].id);
				        }
				    )
				    .error(
				        function(data){
				            alert("error");
				            event.targetScope.showCenter('_imgList');
				        }
				    );
		   });
		  
	
	});



//新闻详情
qpzhuanti.controller('getNewsDetail', ['$scope','$http',function ($scope,$http) {
		
		
		  //新闻列表来的消息
		  $scope.$on("from_main_to_getNewsDetail",
  
		     function (event, msg) {
		         
		         //请求新闻详情
		         
		         $http.jsonp(getUrl('getNewsDetail')+'&newsIdtemp='+msg)
				    .success(
				        function(data){
				        	
				        	if(data.length <= 0){
				        		alert("请求的内容没有找到...");
				            	event.targetScope.showCenter('_newsList');
				            	return false;
				        	}
				        	
				        	
				        	$scope.news = data[0];
				        	
				        	$scope.news.isurl = false;
				        	if($scope.news.url){
				        		$scope.news.isurl = true;
				        	}
				        	$scope.news.content = $scope.news.content.replace(/iframe/g,'');
				        	
				        	//console.log($scope.news);
				        	setHash('_newsDet-'+data[0].id);
				        }
				    )
				    .error(
				        function(data){
				            alert("error");
				            event.targetScope.showCenter('_newsList');
				        }
				    );
		   });
		  
		  console.log('getNewsDetail')
	}]);



//右侧 4、赛事简介
commonController('getCompetitionJianJie',function(ng,data){
	
	ng.scope.content = data[0].content;
},
function(ng){
	//ng.scope.content = '<p style="color:#eed432">sssssssssss赛撒地方撒地方奥德赛发送的发生等待辅导费地方地方阿道夫 </p>';
	//ng.scope.content = ng.sce.trustAsHtml(ng.scope.content);
}

);



//1、通栏、两侧背景图片

commonController('getZhuantiImg',function(ng,data){
	
	ng.scope.path = data[0].path;
});

//左侧 2、图片集锦
commonController('getTop5JingCaiTuJiList',function(ng,data){
	for(var i in data){
		//data[i].tar = '_self';
		data[i].url = 'javascript:;';//'#ImgDetail-'+data[i].id;
		
	}
	ng.scope.list = data;
});





//首页 轮播图列表
commonController('getLunBoTuList',function(ng,data){
	
	
	for(var i in data){
		data[i].src = 'src="'+data[i].path+'"';
		
	}
	
	ng.scope.list = data;
	
	
	setTimeout(function(){
		
		$('#silder').imgSilder({
				s_width:465, //容器宽度
				s_height:245, //容器高度
				is_showTit:true, // 是否显示图片标题 false :不显示，true :显示
				s_times:10000, //设置滚动时间
				css_link:'css/style.css'
			});
	},0);
	 
	           //console.log(data)
});

//首页 置顶新闻
commonController('getTopNewsList',function(ng,data){
	
	//ng.scope.content = ng.sce.trustAsHtml(data[0].content);
	ng.scope.content = data[0].content;
	            //console.log(data)
});

//首页 新闻列表前5
commonController('getTop5NewsList',function(ng,data){
	
	for(var i in data){
		if(data[i].url){
			data[i].tar = '_blank';
			data[i].id = 0;
		}else{
			data[i].tar = '_self';
			data[i].url = 'javascript:;';//'#NewsDetail-'+data[i].id;
		}
	}
	
	
	ng.scope.list = data;
	           
	
	ng.scope.showNewsById2 = function(id){
		
		ng.scope.$emit("from_getTop5NewsList", id);
		
	};
	
});



// 新闻列表
commonController('getNewsList',function(ng,data){
	//console.log(data);
	
	for(var i in data){
		if(data[i].url){
			data[i].tar = '_blank';
			data[i].id = 0;
		}else{
			data[i].tar = '_self';
			data[i].url = 'javascript:;';//'#NewsDetail-'+data[i].id;
		}
	}
	//ng.scope.list = data;
	ng.scope.page = new Page({pData:data,pClass:'current',pOne:15});
	           
},function(ng){
	
	
	//ng.scope.page = new Page({data:data});
	
	
});

// 赛事简介
commonController('getCompetitionIntroduceInfo',function(ng,data){
	
	ng.scope.competitionScheduleSwitch = data[0].competitionScheduleSwitch == 'on' ? true : false;	//赛事日程表开关
	ng.scope.groupIntroduceSwitch = data[0].groupIntroduceSwitch == 'on' ? true : false;	//参赛队介绍开关
	ng.scope.content = data[0].competitionIntroduce.replace('iframe','');
	//console.log(ng.scope.content)
	//console.log(encodeHtml(data[0].competitionIntroduce))
	ng.scope.competitionIntroduceCurr = 'curr';
	ng.scope.showContent = function(id){
		
		ng.scope.content = data[0][id].replace('iframe','');
		
		ng.scope.competitionIntroduceCurr = ng.scope.groupIntroduceCurr = ng.scope.competitionScheduleCurr = '';
		ng.scope[id+'Curr'] = 'curr';
	};
	
});

//图片集锦列表
commonController('getJingCaiTuJiList',function(ng,data){
	
	for(var i in data){
		//data[i].tar = '_self';
		data[i].url = 'javascript:;';//'#ImgDetail-'+data[i].id;
		
	}
	
	
	ng.scope.list = data;
	ng.scope.page = new Page({pData:data,pClass:'current',pOne:9});
});



/***







**/





















