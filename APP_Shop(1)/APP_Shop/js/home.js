mui.init({
	swipeBack: true //启用右滑关闭功能
});
 
document.addEventListener('plusready', function() {
	mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
		//如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
		//解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
		down: {
			callback: LoadHomeData //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
		}
	});

	LoadHomeData();
	CurrentView = plus.webview.currentWebview();
	loadEvent();
});
document.getElementById("sumMonthOrder").addEventListener('tap',function(){
	fxshop.openVW('achievement/achievement_index');
})
document.getElementById("sumMonthReflesh").addEventListener('tap',function(){
	fxshop.openVW('achievement/achievement_index');
})
function loadEvent() {
	


	//绑定商品点击事件
	mui("#homeprolist").on("tap", ".prolist-li .pro-pic", function() {
		var pid = this.dataset.pid;
		showProduct(pid);
	});

	//绑定editeCss的点击事件
	mui("#webview").on("tap", ".editeCss", function() {
		var typeId = this.dataset.linktype; //获取链接类型
		var linkurl = this.dataset.link; //获取链接地址

		var title = this.dataset.title;
		ShowLinkByType(typeId, linkurl, title);

	});




}

template.helper('ShowSiteLink', function(link) {
	if(link.indexOf(apiURL) < 0 && link.indexOf('http://') < 0 && link.indexOf('https://')) {
		link = apiURL.substr(0, apiURL.length - 1) + link;
	}
	return link;
});

template.helper('TypeHref', function(type) {
	var result = "";
	for(var x = 0; x < strcode.length; x++) {
		result += strcode[x]['VerificationPassword'].replace(/(\d{4})(\d{4})(\d+)/, "$1 $2 $3") + '<br>';
	}
	if(result.length > 0) {
		result = result.substring(0, result.length - 1);
	}
	return result;
});

//根据链接类型返回对应的链接地址

function ShowLinkByType(typeId, link, title) {
	var urllink = apiURL.substr(0, apiURL.length - 1);
	if(link == '#' || link == "") {
		return;
	}
	switch(parseInt(typeId)) {
		case 1: //商品详情(productdetail.html)
			urllink = link;
			var productId = urllink.substr(urllink.lastIndexOf('?') + 4, urllink.length - urllink.lastIndexOf('?'));
			showProduct(productId);
			break;
		case 2: //商品分类  (category.html)
			urllink = "category.html";
			if(!isMain()) plus.webview.currentWebview().close();
			mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), "gohome", {
				'pagename': "category"
			});
			fxshop.openVW(plus.webview.getLaunchWebview().id);
			break;
		case 3: //商品列表
			urllink = link;
			var cateId = urllink.substr(urllink.lastIndexOf('?') + 5, urllink.length - urllink.lastIndexOf('?'));
			fxshop.openVW('search-result',{'keywords': '','pid':cateId});
			break;			
		case 4: //品牌详情(/Appshop/BrandDetail.aspx?BrandId=34)
			urllink += link;
			fxshop.OpenWapWeb(urllink, '品牌详情');
			break;
		case 5: //幸运大转盘(/appshop/BigWheel.aspx?activityid=1)
			urllink += link;
			fxshop.OpenWapWeb(urllink, '自定义');
			break;
		case 7: //会员主页(userhome.html)
			urllink = "userhome.html";
			if(!isMain()) plus.webview.currentWebview().close();
			mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), "gohome", {
				'pagename': 'userhome'
			});
			fxshop.openVW(plus.webview.getLaunchWebview().id);
			break;
		case 8: //购物车(shopcart.html)
			urllink = "shopcart.html";
			if(!isMain()) plus.webview.currentWebview().close();
			mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), "gohome", {
				'pagename': 'shopcart'
			});
			fxshop.openVW(plus.webview.getLaunchWebview().id);
			break;
		case 10: //自定义链接
			urllink = link;
			fxshop.OpenWapWeb(urllink, "自定义链接");
			break;
		case 12: //团购（/Appshop/GroupBuyList.aspx）
			urllink += link;
			fxshop.OpenWapWeb(urllink, '团购');
			break;
		case 13: //限时购(/Appshop/CountDownProducts.aspx)
			urllink += link;
			fxshop.OpenWapWeb(urllink, '限时购');

			break;
		case 14: //自定义页面（/Appshop/Topics.aspx?TopicId=4）
			urllink += link;
			fxshop.OpenWapWeb(urllink, title);
			break;
		case 15: //积分商城（/Appshop/PointMall.aspx）
			urllink += link;
			fxshop.OpenWapWeb(urllink, '积分商城');
			break;
		case 16: //优惠券列表（/Appshop/couponslist.aspx）
			urllink += link;
			fxshop.OpenWapWeb(urllink, '优惠券列表');
			break;
		case 17: //注册送券（/Appshop/RegisteredCoupons.aspx）
			urllink += link;
			fxshop.OpenWapWeb(urllink, '注册送券');
			break;
		case 18: //选择优惠券（/Appshop/CouponDetails.aspx?couponId=2）
			urllink += link;
			fxshop.OpenWapWeb(urllink, '优惠券');
			break;
		case 19: //火拼团（FightGroupList.html）
			urllink = "rushgrouplist";
			fxshop.openVW(urllink);
			break;
		case 20: //周边门店（/Appshop/StoreList）
			mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), "updateMenu", {
				"href": "nearstorelist.html"
			});
			fxshop.openVW(plus.webview.getLaunchWebview().id);
			break;
		case 21: //选择文章详情（/appshop/ArticleDetails?articleId=14x）
			urllink += link;
			fxshop.OpenWapWeb(urllink, '文章详情');
			break;
		case 22: //摇一摇（Shake.html）
			urllink = "shake";
			if(!fxshop.isLogin()) {
				showLogin();
				return;
			}
			fxshop.openVW(urllink);
			break;
		case 24: //品牌专题(/Appshop/BrandList)
			urllink += link;
			fxshop.OpenWapWeb(urllink, '品牌专题')
			break;
		case 23: //电话（23）
			link = link.replace('tel://', '');
			if(mui.os.plus) {
				plus.device.dial(link);
			} else {
				location.href = link;
			}
			urllink = "";
			break;
		
		default:
			urllink += link;
			fxshop.OpenWapWeb(urllink, title)
			break;
	};
}

function isMain() {
	var subpages = ['home.html', 'category.html', 'shopcart.html', 'userhome.html', 'nearstorelist.html', 'storehome1.html'];
	return subpages.indexOf(plus.webview.currentWebview().id) != -1;
}

//页面加载数据
function LoadHomeData() {
	var w = plus.nativeUI.showWaiting('', {
		padlock: true
	});
	var content = document.querySelector('.mui-content');
	mui.ajax(fxshop.goUrl('getDefaultData'), {
		dataType: 'json',
		type: 'post',
		timeout: 10000,
		success: function(data) {
			var result = data.Result;
			var ProductsList = {
				ProductsList: result.tagProducts
			}
			document.getElementById("homeprolist").innerHTML = template('prodata', ProductsList);
			LoadTemplateView(result.HomeTopicPath);
			mescroll.endSuccess();
			plus.navigator.closeSplashscreen(); 
		},
		error: function(xhr, type, errorThrown) {
			mui.toast("网络请求超时，请重新加载");
			mescroll.endErr();
		},
		complete: function() {
			w.close();
		}
	});
}

function OpenSkus(pid) {
	if(!fxshop.isLogin()) {
		showLogin();
		return;
	}
	ClickCart(pid);
}

//加载可视化模板
function LoadTemplateView(dataurl) {
	var strHtml = "";
	var swiperstr = [];
	var swiperData = [];
	mui.ajax(dataurl + '?d=' + new Date(), {
		dataType: 'string',
		type: 'get',
		timeout: 10000,
		success: function(res) {
			var viewTemp = JSON.parse(res).LModules;
			viewTemp.forEach(function(item, index, array) {
				var typeitem = item.type;
				if(typeitem == 9) { //轮播图控件
					swiperstr.push(item.id);
					swiperData.push(item.content.dataset);
				}
				if(typeitem == 11) {
					strHtml += template('temp' + typeitem, {
						'dataset': item.content.height,
						controlId: item.id
					});
				} else {
					strHtml += template('temp' + typeitem, {
						'dataset': item.content.dataset,
						controlId: item.id
					});
				}

			});

			document.getElementById("webview").innerHTML = strHtml;
			//初始化轮播控件
			setTimeout(IniteSwiperControl(swiperstr,swiperData), 2000)
		},
		error: function(xhr, type, errorThrown) {
		}
	})
}

function IniteSwiperControl(swipercontrol,swiperData) {
	if(swipercontrol.length > 0) {
		for(var x = 0; x < swipercontrol.length; x++) {
			var swiper = eval('swiper' + swipercontrol[x]);
			var loop = swiperData[x].length > 1;
			swiper = new Swiper('#swiper' + swipercontrol[x], {
				loop: loop,
				autoplay: 3000,
				pagination: '.swiper-pagination'
			});
		}
	}
}