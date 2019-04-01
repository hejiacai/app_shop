//http://pos.wulilu.cn/AppShop/AppShopHandler.ashx
var appiniturl = 'http://pos.wulilu.cn/';
var apiURL = localStorage.getItem('apiUrl') || appiniturl;
	AppName = '移动云商城App',
	app_key = 'fxshop',
	qqKey = "QKTBZ-LGOW3-QSP3V-3L65O-JM7ES-7PFAW",
	meiqiaEid = "39944",
	CurrentView = null; //当前页面对象
(function($, app) {
	/*app.md5Data = function(oldData) {
		var data = JSON.parse(JSON.stringify(oldData || {})) //保存原始数据
		data = data || {};
		data.app_key = app_key;
		data.timestamp = app.timeFormat();
		var keys = [];
		for(var k in data) {
			if(data[k] === 0 || data[k] === false || data[k]) {
				keys.push(k);
			} else {
				delete data[k];
			}
		}

		keys = keys.sort();
		var signStr = '';
		for(var i = 0; i < keys.length; i++) {
			signStr += keys[i].toLowerCase() + data[keys[i]];
		}
		//plus.push.getClientInfo().appkey
		data.sign = md5(signStr + plus.push.getClientInfo().appkey);
		return data;

	}*/

	app.isJoin = function() {
		var userState = JSON.parse(localStorage.getItem('$state') || "{}");
		if(userState.type == 1) {
			return true;
		} else {
			return false;
		}
	}

	app.immersed = function() {
		var immersed = 0;
		var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
		if(ms && ms.length >= 3) {
			immersed = parseFloat(ms[2]);
		}
		return immersed;
	}

	app.immersedCom = function() {
		var immersed = app.immersed();
		if(!immersed) {
			return;
		}
		var head = document.querySelector('header'),
			content = document.querySelector('header~.mui-content'),
			scroll = document.querySelector('header~.scroll-div'),
			membersbox = document.querySelector('membersbox');
		var immersedIos = isIphoneX();
		if(immersedIos) {
			if(head) {
				head.className += ' Xheader';
				head.style.paddingTop = immersed + 'px';
			}
			if(content) {
				content.style.paddingTop = head.offsetHeight + 44 + 'px';
			}
			if(scroll) {
				scroll.style.top = head.offsetHeight + 44 + 'px';
			}
			if(membersbox) {
				membersbox.style.top = head.offsetHeight + 44 + 'px';
			}
		} else {
			if(head) {
				head.style.paddingTop = immersed + 'px';
			}

			if(content) {
				content.style.paddingTop = head.offsetHeight + 20 + 'px';
			}
			if(scroll) {
				scroll.style.top = head.offsetHeight + 'px';
			}
			if(membersbox) {
				membersbox.style.top = head.offsetHeight + 'px';
			}
		}

	}

	app.immersedSide = function() {
		var immersed = app.immersed();
		if(!immersed) {
			return;
		}
		document.body.className += 'immersed';
	}

	app.immersedNav = function() {
		var immersed = app.immersed();
		if(!immersed) {
			return;
		}
		var nav = document.getElementById('fixedNav');
		if(nav) {
			nav.style.top = immersed + 44 + 'px';
		}
	}
	//	app.immersedNoTop = function() {
	//		var immersed = app.immersed();
	//		if(immersed) {
	//			return;
	//		}
	//
	//		document.body.className += ' notimmersed';
	//	}

	//	app.getState = function() {
	//		var stateText = localStorage.getItem('login') || "{}";
	//		return JSON.parse(stateText);
	//	};
	//
	//	app.setState = function(state) {
	//		state = state || {};
	//		localStorage.setItem('login', JSON.stringify(state));
	//	};

	app.checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	app.checkPhone = function(phone) {
		phone = phone || '';
		var reg = /^0?(13|15|18|14|17)[0-9]{9}$/;
		return(reg.test(phone));
	};

	/**
	 * 获取本地是否安装客户端
	 **/
	app.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}

	app.back = function(hide) {
		if(plus) {
			CurrentView || (CurrentView = plus.webview.currentWebview());
			if(hide || CurrentView.preate) {
				CurrentView.hide('auto');
			} else {
				CurrentView.close('auto');
			}
		} else if(history.length > 1) {
			history.back();
		} else {
			plus.close();
		}
	}; /*大于零显示元素*/
	app.whichShow = function(data, el) {
		if(data > 0) {
			document.getElementById(el).innerText = data.toString();
			document.getElementById(el).style.display = 'block';
		} else {
			document.getElementById(el).style.display = 'none';
		}

	}

	/*不为空显示*/
	app.nullShow = function(data, el) {
		if(data != '' && data != null) {
			document.getElementById(el).innerText = data;
			document.getElementById(el).style.display = 'block';
		} else {
			document.getElementById(el).style.display = 'none';
		}

	}

	//阻止a链接跳转
	app.stopHref = function(el) {
		el.on('tap', 'a', function(e) {
			e.preventDefault();
		});
	}

	app.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	app.addClass = function(el, name) {
		if(!el)
			return;
		if(el.className.indexOf(name) < 0)
			el.className = el.className + " " + name;
	}

	app.removeClass = function(el, name) {
		if(!el)
			return;
		if(el.className.indexOf(name) >= 0)
			el.className = el.className.replace(name, '');
	}
	app.hasClass = function(el, name) {
		return(el.className.indexOf(name) >= 0);
	}

	app.selectValue = function(el) {
		return el.options[el.selectedIndex].value;
	}

	app.isLogin = function() {

		var siteinfo = SiteSetting.getSiteInfo();
		return(siteinfo.UserInfo != undefined && siteinfo.UserInfo != null);
	}

	//QQ在线咨询
	app.openQQ = function(qq) {
		if(!isQQInstalled()) {
			mui.alert('你的手机尚未安装QQ');
			return;
		}
		if(plus.os.name == "Android") {
			plus.runtime.openURL("mqqwpa://im/chat?chat_type=wpa&uin=" + qq);
		} else if(plus.os.name == "iOS") {
			plus.runtime.openURL("mqq://im/chat?chat_type=wpa&uin=" + qq + "&version=1&src_type=web");
		}
	}

	//重写退出应用
	app.quitApp = function() {
		$.oldBack = mui.back;
		var backButtonPress = 0;
		$.back = function(event) {
			backButtonPress++;
			if(backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出' + AppName);
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		};
	}

	//复制到剪切板
	app.copyclip = function(text) {
		if(plus.os.name.toLowerCase() == 'ios') {
			var UIPasteboard = plus.ios.importClass("UIPasteboard");
			var generalPasteboard = UIPasteboard.generalPasteboard();
			generalPasteboard.setValueforPasteboardType(text, "public.utf8-plain-text");
			//var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text"); 
			mui.toast('复制成功');
		} else {
			var Context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
			plus.android.invoke(clip, "setText", text);
			mui.toast('复制成功');
		}
	};

	//打开软键盘
	app.openSoftKeyboard = function() {
		if(mui.os.ios) {
			var webView = plus.webview.currentWebview().nativeInstanceObject();
			webView.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		} else {
			var webview = plus.android.currentWebview();
			plus.android.importClass(webview);
			webview.requestFocus();
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
		}
	};

	//时间处理
	app.countDown = function(time, callback) {
		var day = 0,
			hour = 0,
			minute = 0,
			second = 0;
		if(time > 0) {
			day = '' + Math.floor(time / (24 * 60 * 60));
			hour = '' + Math.floor(time / (60 * 60) - (day * 24));
			minute = '' + Math.floor(time / 60 - (day * 24 * 60) - (hour * 60));
			second = '' + Math.floor(time - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60));
		}
		if(day < 10) {
			day = '0' + day;
		}
		if(hour < 10) {
			hour = '0' + hour;
		}
		if(minute < 10) {
			minute = '0' + minute;
		}
		if(second < 10) {
			second = '0' + second;
		}
		callback(day, hour, minute, second);
	}

	app.goUrl = function(parmas) {
		return apiURL + 'AppShop/AppShopHandler.ashx?action=' + parmas;
	}

	app.initSwiper = function() {
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			autoplay: 4000,
			speed: 500
		});
	}

	//打开新窗口
	app.openVW = function(id, extras, url) {
		$.openWindow({
			//			createNew: id == "product-detail" || id == 'storeproduct-detail',
			id: id,
			url: url || id + ".html",
			extras: extras,
			show: {
				autoShow: true,
				aniShow: 'pop-in',
				duration: 300
			},
			waiting: {
				autoShow: false
			}
		});
	}
	//双击头部返回顶部
	app.backTop = function() {
		document.querySelector('header').addEventListener('doubletap', function() {
			mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);
		})
	}

	//菜单跳转首页
	app.goNavbar = function() {
		plus.webview.currentWebview().close();
		mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), "gohome", {
			'pagename': pagename
		});
		//mui.fire(plus.webview.getWebviewById('main'),'gohome');
	}

	app.timeFormat = function(time, params) {
		var d = time ? new Date(time) : new Date(),
			year = d.getFullYear(),
			month = d.getMonth() + 1,
			day = d.getDate(),
			hours = d.getHours(),
			minutes = d.getMinutes(),
			seconds = d.getSeconds();

		if(month < 10) month = '0' + month;
		if(day < 10) day = '0' + day;
		if(hours < 10) hours = '0' + hours;
		if(minutes < 10) minutes = '0' + minutes;
		if(seconds < 10) seconds = '0' + seconds;

		if(params) {
			return {
				year: year,
				month: month,
				day: day
			};
		} else {
			return(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds);
		}
	}

	app.timeSection = function(d, el) {
		var nowDate = app.timeFormat('', 'arg'),
			year = nowDate.year,
			month = nowDate.month,
			day = nowDate.day,
			resultStart,
			resultEnd;
		switch(d) {
			case '1':
				resultStart = resultEnd = year + '-' + month + '-' + day;
				break;
			case '7':
				resultEnd = year + '-' + month + '-' + day;
				var first = [7, 1, 2, 3, 4, 5, 6][new Date().getDay()],
					f = new Date(),
					f = f.setDate(f.getDate() - first + 1);
				resultStart = app.timeFormat(f).substring(0, 10);
				break;
			case '30':
				resultStart = year + '-' + month + '-01';
				resultEnd = year + '-' + month + '-' + day;
				break;
			case '90':
				resultEnd = year + '-' + month + '-' + day;
				if(month - 2 == 0) {
					year -= 1;
					month = 12;
				} else if(month - 2 == -1) {
					year -= 1;
					month = 11;
				} else if(month - 2 < 10) {
					month = '0' + (month - 2);
				} else {
					month = month - 2;
				}
				resultStart = year + '-' + month + '-01';
				break;
		}
		el.setAttribute('data-start', resultStart);
		el.setAttribute('data-end', resultEnd);
	}

	app.parseDomImg = function(str, base) {
		var objE = document.createElement("div");
		objE.innerHTML = str;

		base = base || '';
		var imgs = objE.querySelectorAll('img');
		for(var i = 0; i < imgs.length; i++) {
			var img = imgs[i];
			img.setAttribute('data-delay', img.src);
			img.src = base + 'images/blank.gif';
			img.setAttribute('height', '100px');
			img.setAttribute('width', '100%');
		}
		return objE.innerHTML;
	};
	app.update = function() {
		setTimeout(function() {
			localStorage.setItem('apiUrl', "");
			var uuid = plus.device.uuid;
			var type = plus.os.name.toLowerCase();
			var version = localStorage.getItem('version') || plus.runtime.version;
			var isfirst = plus.storage.getItem("launchFlag");
			mui.ajax(appiniturl + 'AppShop/AppShopHandler.ashx?action=appInit', {
				data: {
					'VID': uuid,
					'device': type,
					'version': version,
					'isFirst': isfirst
				},
				dataType: 'json',
				type: 'get',
				timeout: 10000,
				success: function(data) {
					localStorage.setItem('version', data.Result.version); //存储当前版本

					var actapiurl = data.Result.AppAuditAPIUrl; //当前需要请求的路径

					var tempruntimeversion = plus.runtime.version.replace(/\./g, "");
					var tempcurrentversion = data.Result.CurrentVersion.replace(/\./g, ""); //当前的版本号
					var currentsite = SiteSetting.getSiteInfo();
					var tag = false; //默认为本地版本比接口版本要低
					for(var x = 0; x < tempcurrentversion.length - 1; x++) {
						var cversion = tempcurrentversion.substr(x, 1);
						if(x <= tempruntimeversion.length) {
							var rversion = tempruntimeversion.substr(x, 1);
							if(rversion > cversion) {
								tag = true;
								break;
							}
						}
					}
					if(tag && actapiurl) { //为true代表需要请求接口返回的路径地址
						apiURL = actapiurl;
					}
					if(apiURL.lastIndexOf('/') != apiURL.length - 1) { //如果不以斜杠结尾
						apiURL = apiURL + '/';
					}

					localStorage.setItem('apiUrl', apiURL);

					if(data.Result.existNew == "true") { //如果存在更新或者强制更新时
						var btns = ["立即更新", "取 消"];
						if(data.Result.forcible) btns = ["立即更新"];
						plus.nativeUI.confirm('发现新版本' + AppName + '，马上体验吧！', function(event) {
							if(0 == event.index) {
								plus.runtime.openURL(data.Result.upgradeUrl);
							}
						}, '', btns);
					}
				}
			});
		}, 5000)
	}

	app.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.account.length < 4) {
			return callback('账号最短为 4 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var waitLogin = plus.nativeUI.showWaiting();

		$.ajax(apiURL + 'AppShop/AppShopHandler.ashx?action=login', {
			data: {
				userName: loginInfo.account,
				password: loginInfo.password
			},
			dataType: 'json',
			type: 'get',
			timeout: 20000,
			success: function(data) {
				waitLogin.close();
				if(data.ErrorResponse != undefined) {
					plus.nativeUI.toast(data.ErrorResponse.ErrorMsg);
					return;
				} else {
					plus.nativeUI.toast("登录成功");
					return app.createState(data.Result, callback);
				}
			},
			error: function(xhr, type, errorThrown) {
				waitLogin.close();
				callback('请求失败，请检查网络');
			}
		});
	};

	app.createState = function(data, callback) {
//		
//		siteinfo.UserInfo = data; 
//		SiteSetting.setSiteInfo(siteinfo);	
//		console.log(JSON.stringify(siteinfo));
//		plus.webview.getWebviewById("login.html").close();
//		mui.fire(plus.webview.getWebviewById('userhome.html'), 'updateData');
//	
		var state = SiteSetting.getSiteInfo();
		state.UserInfo = data;
		SiteSetting.setSiteInfo(state);
		return callback();
	};

	app.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		var re = /[^\d]+/;
		if(regInfo.account.length < 4 || !re.test(regInfo.account)) {
			return callback('请输入正确的邮箱地址');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		var realName = document.getElementById("NameAccount").value;
		var sex = document.getElementById("sex").innerText;
		var age = document.getElementById("age").innerText;
		if(sex == "男") {
			sex = "男士"
		} else {
			sex = "女士"
		}

		var waitReg = plus.nativeUI.showWaiting();
		$.ajax(apiURL + 'AppShop/AppShopHandler.ashx?action=regiester', {
			data: {
				userName: regInfo.account,
				password: regInfo.password,
				email: regInfo.email,
				code: regInfo.emailCode,
				RealName: realName,
				sex: sex,
				birthDay: age,
			},
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			success: function(data) {
				waitReg.close();
				if(data.ErrorResponse != undefined) {
					return callback(data.ErrorResponse.ErrorMsg);
				}else{
					siteinfo.UserInfo = data.Result; 
					SiteSetting.setSiteInfo(siteinfo);
					if(plus.webview.getWebviewById("login.html")){
						plus.webview.getWebviewById("login.html").close(); 
					}
					if(plus.webview.getWebviewById("appauto")){
						plus.webview.getWebviewById("appauto").close();
					}
					mui.fire(plus.webview.getWebviewById('userhome.html'), 'updateData');
					return callback(null, data);
				}				 
			},

			error: function(xhr, type, errorThrown) {
				waitReg.close();
				return callback(xhr.responseText.split('ErrorMsg =')[1])
			}
		});

	};

	app.getSiblings = function(elm) {
		var a = [];
		var p = elm.parentNode.children;
		for(var i = 0, pl = p.length; i < pl; i++) {
			if(p[i] !== elm) a.push(p[i]);
		}
		return a;
	};

	//显示商品券码状态
	app.getVerficationStatus = function(status) {
		switch(status) {
			case 0:
				return "未消费";
				break;
			case 1:
				return "已消费";
				break;
			case 3:
				return "已过期";
				break;
				break;
			case 4:
				return "退款中";
				break;
			default:
				return "已退款";
				break;

		};
	};

	//判断是否是ios
	app.ios = function() {
		if(plus.os.name.toLowerCase() == 'ios') {
			return true;
		} else {
			return false;
		}
	};

	//IOS判断QQ是否已经安装
	app.isQQInstalled = function() {
		var TencentOAuth = plus.ios.import("TencentOAuth");
		var isQQInstalled = TencentOAuth.iphoneQQInstalled();
		return isQQInstalled == '0' ? false : true
	};
	//IOS判断微信是否已经安装
	app.isWXInstalled = function() {
		var Weixin = plus.ios.import("WXApi");
		var isWXInstalled = Weixin.isWXAppInstalled();
		return isWXInstalled == '0' ? false : true;
	};

	app.isPInt = function(str) {
		var g = /^[1-9]*[1-9][0-9]*$/;
		return g.test(str);
	};

	app.customHref = function() {
		mui('.mui-content').on('tap', '.custom-href', function() {
			var href = this.getAttribute('data-href').toLowerCase(),
				id;
			if(href.indexOf(URL) >= 0) {
				if(href.indexOf('product/detail/') >= 0) {
					id = href.split('product/detail/')[1];
					showProduct(id);
				} else if(href.indexOf('topic/detail/') >= 0) {
					id = href.split('topic/detail/')[1];
					fxshop.openVW('topic-detail.html', {
						topicId: id
					})
				} else if(href.indexOf('gift/detail/') >= 0) {
					id = href.split('gift/detail/')[1];
					fxshop.openVW('integral-detail.html', {
						giftId: id
					})
				} else {
					plus.runtime.openURL(href)
				}
			} else {
				plus.runtime.openURL(href)
			}

		});
	};
	app.showModelePanel = function(PanelId) {
		var pageid = localStorage.getItem("currentview");
		CurrentView = plus.webview.getWebviewById(pageid);
		// 开启遮罩
		CurrentView.setStyle({
			mask: "rgba(0,0,0,0.5)"
		});

		document.getElementById(PanelId).className = document.getElementById(PanelId).className.replace("mui-hidden", "");
	};
	app.closeModelPanel = function(PanelId) {
		var pageid = localStorage.getItem("currentview");
		plus.webview.getWebviewById(pageid).setStyle({
			mask: "none"
		});
	};
	app.OpenWapWeb = function(url, titilename) {
		pagename = "appauto";
		var webpage = plus.webview.getWebviewById("appauto");
//		if(!webpage && url.indexOf('/SubmmitOrder') < 0 &&
//			url.indexOf('/MemberOrderDetails') < 0 && url.indexOf("RechargeRequest") < 0 && url.indexOf("GroupBuyProductDetail")<0) {
//			pagename = "wapwebview";
//			webpage = plus.webview.getWebviewById("wapwebview");
//		}

		//限时抢购带上经纬度坐标

		if(url.indexOf('CountDownProducts?StoreId=') >= 0 || url.indexOf('CountDownStoreProductsDetails') >= 0) {
			var siteinfo = SiteSetting.getSiteInfo();
			if(siteinfo.Location) {
				url += "&city=" + siteinfo.Location.city + "&lat=" + siteinfo.Location.lat + "&lng=" + siteinfo.Location.lng + "&address=" + siteinfo.Location.address;
			}
		}
		if(webpage) {
			mui.fire(webpage, "UpdateWapPage", {
				'name': titilename,
				'url': url
			});
		}
		fxshop.openVW(pagename, {
			'link': url,
			'name': titilename
		});
	}

}(mui, window.fxshop = {}));

fxshop.immersedCom();

var pays = {};

// 支付模块
function checkServices(pc) {
	if(!pc.serviceReady) {
		var txt = null;
		switch(pc.id) {
			case "alipay":
				txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
				break;
			default:
				if(plus.os.name == "iOS") return;
				txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
				break;
		}
		plus.nativeUI.confirm(txt, function(e) {
			if(e.index == 0) {
				pc.installService();
			}
		}, pc.description);
	}
}

function initPay() {
	plus.payment.getChannels(function(channels) {
		//var content=document.getElementById(dcontent);
		for(var i in channels) {
			var channel = channels[i];
			if(channel.id == 'alipay' || channel.id == 'wxpay') {
				pays[channel.id] = channel;
				var de = document.createElement('div');
				de.setAttribute('class', 'custom-btn ' + channel.id);

				de.id = channel.id;
				de.innerText = channel.description + "支付";

				checkServices(channel);

			}
		}
	}, function(e) {
		plus.nativeUI.alert("获取支付方式失败：" + e.message);
	});
}

function payOrder(id, order, successBack, errorBack) {

	if(id != 'alipay' && id != 'wxpay') {
		plus.nativeUI.alert("不支持此支付通道！");
		return;
	}
	if(id == 'wxpay') {
		order = JSON.parse(decodeURIComponent(order));
	}

	plus.payment.request(pays[id], order, function(result) {

		mui.fire(plus.webview.getWebviewById('submitorder'), 'submitorder', {
			'ret': 1
		});

	}, function(e) {
		//alert(JSON.stringify(e));
		mui.fire(plus.webview.getWebviewById('submitorder'), 'submitorder', {
			'ret': 0
		});
	});
}

var SiteSetting = {
	setSiteInfo: function(siteinfo) {
		siteinfo = siteinfo || {};
		localStorage.setItem('siteinfo', JSON.stringify(siteinfo));
	},

	getSiteInfo: function() {
		var siteinfo = localStorage.getItem('siteinfo') || "{}";
		return JSON.parse(siteinfo);
	}
};

function SetWapUserInfo() { 
	var siteinfo = localStorage.getItem('siteinfo') || "{}";
	var tempsite = JSON.parse(siteinfo);
	tempsite.QQKey = qqKey;
	plus.storage.setItem("wapsiteinfo", JSON.stringify(tempsite));
}

function getCurrentPosition() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		navigator.toast("浏览器不支持定位");
	}
}

function showPosition(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;

}

//是否需要返回上一级
function BackPage() {
	var isback = false; //默认需要返回上一级
	var backstr = ["收货地址", "订单详情", "预付款账户"];
	if(document.querySelector('.mui-title')) {
		var titlename = document.querySelector('.mui-title').innerText;
		for(var a = 0; a < backstr.length; a++) {
			if(titlename.indexOf(backstr[a]) == 0) {
				isback = true;
				break
			}
		}
	}
	return isback;
}

var skuCurrentView = null;
//点击弹出规格
function ClickCart(productid, source, activeid) {
	// 防止快速点击可能导致多次创建

	/*if(skuCurrentView) {
		return;
	}*/

	// 创建侧滑页面
	var openpage = "skuProduct";
	if(source == 3 || source == 5) {
		openpage = "Fight_sku_Product";
	}
	skuCurrentView = plus.webview.getWebviewById(openpage + ".html");
	mui.fire(skuCurrentView, "UpdateData", {
		productId: productid,
		source: source,
		activeid: activeid
	})

	// 侧滑页面关闭后关闭遮罩
	// 开启遮罩
	localStorage.setItem("currentview", CurrentView.id);
	CurrentView.setStyle({
		mask: "rgba(0,0,0,0.5)"
	});
	skuCurrentView.addEventListener('hide', function() {
		CurrentView.setStyle({
			mask: "none"
		});
		skuCurrentView = null;
	}, false);
	// 侧滑页面加载后显示（避免白屏）

	skuCurrentView.addEventListener("loaded", function() {
		skuCurrentView.show("slide-in-bottom", 200);
	}, false);
	/*
	mui.openWindow({
		id: openpage+'.html',
		url: openpage+'.html',
		show: {
			autoShow: false,
			aniShow: 'pop-in',
			duration: 300
		},
		waiting: {
			autoShow: false
		}
	});*/
}

function getLikeProductIds(pid) {
	var likepids = plus.storage.getItem("likeproId");
	if(pid) {
		if(likepids) { //存在
			var temp = likepids + ',';
			if(temp.indexOf(pid + ',') < 0) //不包含{
				likepids += "," + pid;
		}
	} else {
		likepids = pid;
	}
	return likepids;
}

//获取索引
function getIndex(el) {
	var child = el.parentNode.children;
	for(var i = 0; i < child.length; i++) {
		if(el == child[i])
			return i;
	}
}

//是否为空对象
function isEmptyObject(el) {
	for(var n in el) {
		return false
	}
	return true;
}

function siblings(el, childEl) {
	var r = [],
		n;
	if(!childEl)
		n = el.parentNode.children;
	else
		n = el.parentNode.querySelectorAll(childEl);
	for(var i = 0, pl = n.length; i < pl; i++) {
		if(n[i] !== el)
			r.push(n[i]);
	}
	return r;
}

function showLogin(params, url) {
	mui.openWindow({
		id: 'login.html',
		url: 'login.html',
		extras: {
			params: params
		},
		show: {
			autoShow: true,
			aniShow: 'zoom-fade-out'
		},
		waiting: {
			autoShow: false
		}
	});
}

mui('body').on('tap', '#closeWv', function() {
	if(plus.webview.currentWebview().parent() != null)
		plus.webview.currentWebview().parent().close();
	else
		plus.webview.currentWebview().close();
});

mui('body').on('tap', '#reloadWv', function() {
	plus.webview.currentWebview().reload();
});

function showNav() {
	mui("#navbar").on('tap', 'li', function() {
		var pagename = this.dataset.page;
		var mainId = plus.webview.getLaunchWebview().id;
		switch(pagename) {
			case "home":
				plus.webview.currentWebview().close();
				var pagename = 'home';
				mui.fire(plus.webview.getWebviewById(mainId), "gohome", {
					'pagename': pagename
				});
				fxshop.openVW(mainId);
				break;
			case "category":
				plus.webview.currentWebview().close();
				var pagename = 'category';
				mui.fire(plus.webview.getWebviewById(mainId), "gohome", {
					'pagename': pagename
				});
				fxshop.openVW(mainId); 
				break;
			case "shopcart":
				plus.webview.currentWebview().close();
				var pagename = 'shopcart';
				mui.fire(plus.webview.getWebviewById(mainId), "gohome", {
					'pagename': pagename
				});
				fxshop.openVW(mainId);
				break;
			default:
				plus.webview.currentWebview().close();
				var pagename = 'userhome';
				mui.fire(plus.webview.getWebviewById(mainId), "gohome", {
					'pagename': pagename
				});
				fxshop.openVW(mainId);
				break;
		};
	});
}

function reloadWvLoad() {
	var errorText = document.createElement('div');
	errorText.innerHTML = '<h4>网络不给力，请检查网络！</h4><button id="reloadWv" class="mui-btn mui-btn-blue">重新加载</button>';
	errorText.setAttribute('class', 'empty-show');
	document.body.appendChild(errorText);
}

function LoadSiteData() {
	mui.ajax(appiniturl + 'AppShop/AppShopHandler.ashx?action=getDefaultData', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			var result = data.Result;

			var ProductsList = {
				ProductsList: result.tagProducts
			}
			delete result.tagProducts;
			var sitesetting = SiteSetting.getSiteInfo();
			sitesetting.Site = result;
			SiteSetting.setSiteInfo(sitesetting);
		},
		error: function(xhr, type, errorThrown) {
			mui.toast("网络请求超时，请重新加载")
		}
	});
}

//更新商品分类模板
function updateCategoryPage() {
	var siteinfo = SiteSetting.getSiteInfo();
	var StoreStatus = siteinfo.Status;
	var IsOpenMultStore = true;

	if(IsOpenMultStore){
		if(StoreStatus == 'platform' || StoreStatus == 'goToStore') {
			if(siteinfo.Site.AppCategoryTemplateStatus == 1) { //商品分类模板一
				subpages[1] = "category.html";
			} else if(siteinfo.Site.AppCategoryTemplateStatus == 2) { //商品分类模板二
				subpages[1] = "categoryTemp2.html";
			} else if(siteinfo.Site.AppCategoryTemplateStatus == 3) { //商品分类模板三
				subpages[1] = "categoryTemp3.html";			
			} else if(siteinfo.Site.AppCategoryTemplateStatus == 0) { //商品分类模板四
				subpages[1] = "categoryTemp4.html";
			}
		} else {
			subpages[1] = "categoryTemp4.html";
		}
	}else{
		if(siteinfo.Site.AppCategoryTemplateStatus == 1) { //商品分类模板一
				subpages[1] = "category.html";
			} else if(siteinfo.Site.AppCategoryTemplateStatus == 2) { //商品分类模板二
				subpages[1] = "categoryTemp2.html";
			} else if(siteinfo.Site.AppCategoryTemplateStatus == 3) { //商品分类模板三
				subpages[1] = "categoryTemp3.html";			
			} else if(siteinfo.Site.AppCategoryTemplateStatus == 0) { //商品分类模板四
				subpages[1] = "categoryTemp4.html";
			}
	}
	document.getElementById("categoryTab").setAttribute('data-href', subpages[1]);
}

//获取定位      
function getPosition() {
	var fromLatLng = "";
	if(navigator.geolocation) {
		//获取手机是否开启GPS
		if(plus.os.name == "Android") {
			var context = plus.android.importClass("android.content.Context");
			var locationManager = plus.android.importClass("android.location.LocationManager");
			var main = plus.android.runtimeMainActivity();
			var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
			androidIsOpen = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
			if(androidIsOpen) {
				//getposition();  
				navigator.geolocation.getCurrentPosition(function(position) {
					var siteinfo = SiteSetting.getSiteInfo();
					lat = position.coords.latitude; //纬度 
					lon = position.coords.longitude; //经度 
					var geocoder = new qq.maps.Geocoder();
					var latLng = new qq.maps.LatLng(lat, lon);

					//转换坐标，html5定位用的是标准的gps坐标，在使用腾讯地图api的时候需要转换坐标才能得到精准的位置
					qq.maps.convertor.translate(latLng, 1, function(position) {
						lat = position[0].lat;
						lon = position[0].lng;
						fromLatLng = lat + "," + lon;
						if(localStorage.getItem("nostoretip") != "0" && localStorage.getItem("nostoretip")) {
							var storetip = localStorage.getItem("nostoretip");
							fromLatLng = storetip.split("-")[0] + "," + storetip.split("-")[1];
							lat = storetip.split("-")[0];
							lon = storetip.split("-")[1];
						}

						latLng = new qq.maps.LatLng(lat, lon);
						//对指定经纬度进行解析
						geocoder.getAddress(latLng);
						//设置服务请求成功的回调函数
						geocoder.setComplete(function(result) {
							var Location = {
								'address': result.detail.nearPois[0].name,
								'city': result.detail.addressComponents.city,
								'lat': lat,
								'lng': lon
							};
							siteinfo.Location = Location;
							SiteSetting.setSiteInfo(siteinfo);
						});

						var sessionid = "";
						if(fxshop.isLogin()) {
							sessionid = SiteSetting.getSiteInfo().UserInfo.sessionid;
						}
						mui.ajax(fxshop.goUrl('GetNearestStore'), {
							dataType: "json",
							type: "post",
							timeout: 10000,
							data: {
								fromLatLng: fromLatLng,
								sessionId: sessionid,

								d: new Date()
							},
							success: function(res) {
								localStorage.setItem('DefaultStorid', 0);
								localStorage.setItem('Status', Status);
								var Status = res.Status;
								siteinfo.Status = Status;
								SiteSetting.setSiteInfo(siteinfo);
								if(res.Status == "error") {
									mui.toast(res.Message);
									return;
								}

								if(res.Status == "noLatLng") { //定位失败
									mui.toast(res.Message);
								}

								var doc = document.getElementById("defaultTab");

								if(res.Status == "storeList") { //进入多门店首页
									doc.setAttribute("data-href", "storelist.html");
									subpages[0] = "storelist.html";
								}
								if(res.Status == "goToStore") { //进入单门店首页

									doc.setAttribute("data-href", "storehome.html");
									subpages[0] = "storehome.html";
									localStorage.setItem('DefaultStorid', res.StoreId);
								}

								if(res.Status == "platform" || res.Status == "noStoreToPlatform") { //进入平台店首页
									localStorage.getItem("nostoretip", "0");
									doc.setAttribute("data-href", "home.html");
									currentsubpages = "home.html";
									subpages[0] = "home.html";
								}
								if(res.Status == "nothing") //进入无平台提示页面
								{
									fxshop.openVW("NoStoreTip", {
										status: 'nothing'
									});
								}
								localStorage.setItem("nostoretip", 0);

							},
							error: function(ex) {
								mui.toast("网络超时，请重新加载");
							},
							complete: function() {
								mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), 'showTabbar');
							}
						});
					});
				}, function(error) {
					console.log(JSON.stringify(error));
					switch(error.code) {
						case error.PERMISSION_DENIED:
							mui.toast("User denied the request for Geolocation.");
							break;
						case error.POSITION_UNAVAILABLE:
							mui.toast("Location information is unavailable.");
							break;
						case error.TIMEOUT:
							mui.toast("The request to get user location timed out.");
							break;
						case error.UNKNOWN_ERROR:
							mui.toast("An unknown error occurred.");
							break;
					}
				});
				mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), 'showTabbar');
			} else {
				mui.toast("请手动开启GPS");
				console.log("未开启GPS定位");
				setTimeout(function() {
					mui.back();
				}, 1000);

			}
		}

	} else {
		plus.nativeUI.toast("该浏览器不支持地理定位");
		mui.fire(plus.webview.getWebviewById(plus.webview.getLaunchWebview().id), 'showTabbar');
	}

}
 
function showProduct(id) {
	mui.fire(plus.webview.getWebviewById('product-detail.html'), 'updateData', {
		productId: id
	});
	mui.openWindow({
		id: 'product-detail.html',
		url: 'product-detail.html',
		show: {
			autoShow: true,
			aniShow: 'pop-in',
			duration: 300
		},
		waiting: {
			autoShow: false
		}
	});

}

function ShowStoreProdduct(pid, storeid, source) {
	mui.fire(plus.webview.getWebviewById('storeproduct-detail.html'), 'UpdateProductData', {
		productid: pid,
		storeid: storeid,
		source: source
	});
	mui.openWindow({
		id: 'storeproduct-detail.html',
		url: 'storeproduct-detail.html',
		show: {
			autoShow: true,
			aniShow: 'pop-in',
			duration: 300
		},
		waiting: {
			autoShow: false
		}
	});

}

function initShare() {
	var shares = {};
	plus.share.getServices(function(s) {
		if(s && s.length > 0) {
			for(var i = 0; i < s.length; i++) {
				var t = s[i];
				shares[t.id] = t;
			}
			return shares;
		}
	}, function() {
		plus.nativeUI.toast('获取分享列表失败');
	});
	return shares;
}

//加载火拼团分享代码

function ShareFight(FightGroupId, orderId) {
	mui.ajax(fxshop.goUrl("FightGroupShare"), {
		data: {
			FightGroupId: FightGroupId,
			orderId: orderId,
		},
		dataType: "json",
		type: "post",
		timeout: 10000,
		success: function(data) {
			if(data["ErrorResponse"] != undefined) {
				mui.toast(data.ErrorResponse.ErrorMsg);
				return;
			}
			shareData = {
				title: data.Result.ShareTitle,
				href: data.Result.ShareLink,
				content: data.Result.ShareContent,
				imgurl: data.Result.ShareImage
			};
			document.getElementById('share').style.display = "block";
			loadShare(shareData);
		},
		error: function(ex) {
			mui.toast(ex);
		}
	});

}

//商品详情分享
function ShareProductDetail(pid, productInfo, storeid) {
	var shareUrl = apiURL + "WapShop/ProductDetails.aspx?productId=" + pid;
	if(storeid) {
		shareUrl = apiURL + "/WapShop/StoreProductDetails?StoreId=" + storeid + "&ProductId=" + pid;
	}

	var shareContent = productInfo.ShortDescription || productInfo.ProductName + "，" + shareUrl;
	shareData = {
		title: productInfo.ProductName,
		href: shareUrl,
		content: shareContent,
		imgurl: storeid ? productInfo.SubmitOrderImg : productInfo.ThumbnailUrl40
	};
	document.getElementById('share').style.display = "block";
	loadShare(shareData);
}

//推广连接分享
function ShareRefreshDetail(sharejson) {
	shareData = {
		title: sharejson.title,
		href: sharejson.url,
		content: sharejson.content,
		imgurl: sharejson.imgurl
	};
	document.getElementById('share').style.display = "block";
	loadShare(shareData);
}

function loadShare(params) {
	var shares = initShare();
	mui('#share').on('tap', 'li', function() {
		var id = this.getAttribute('data-id');
		var scene = this.getAttribute('data-scene');
		var share = shares[id];
		if(share) {
			if(share.authenticated) {
				shareMessage(share, scene, params);
			} else {
				share.authorize(function() {
					shareMessage(share, scene, params);
				}, function(e) {
					mui.toast("认证授权失败：" + e.code + " - " + e.message);

				});
			}
		} else {
			mui.toast("无法获取分享服务，请检查manifest.json中分享插件参数配置，并重新打包")
		}
	});

	mui('#cancel').on('tap', 'a', function() {
		document.getElementById('share').style.display = 'none';
	});

}

//获取请求的参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

function shareMessage(share, scene, params) {
	var msg = {
		extra: {
			scene: scene
		}
	};
console.log(JSON.stringify(params));
	msg.href = params.href;
	msg.title = params.title;
	msg.content = params.content;
	if(share.id != 'sinaweibo') {
		msg.pictures = [params.imgurl];
	} else if(msg.content.indexOf('http') == -1) {
		msg.content += msg.url;
	}
	msg.thumbs = [params.imgurl];
	share.send(msg, function() {
		plus.nativeUI.toast("分享到" + share.description + "成功！ ");
		//console.log(document.getElementById('share'));
		//document.getElementById('share').style.display = 'none';
	}, function(e) {
		console.log(JSON.stringify(e));
		//		plus.nativeUI.alert(JSON.stringify(e),function(e){});
		plus.nativeUI.toast("分享到" + share.description + "取消");
		document.getElementById('share').style.display = 'none';
	});
}

function showTagWidth() {
	if(document.getElementById("storetitle")) {
		var Width = document.getElementById("storetitle").offsetWidth;
		lineWidth = parseFloat(((227 - Width) / 2).toFixed(2));
		document.getElementById("leftLine").style.width = lineWidth + 'px';
		document.getElementById("rightLine").style.width = lineWidth + "px";
		document.getElementById("storetitle").style.left = lineWidth + 24 + "px";
		document.getElementById("rightLine").style.left = lineWidth + Width + 48 + "px";
	}
}

//判断是否是iphone x
function isIphoneX() {
	return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375);
}

//分享订单列表的代金红包
var RedEvenlopOrderId, RedEvenlopsendCode, RedEvenlopId, RedEvenlopTitle, RedEvenlopUrlHref, RedEvenlopicon, RedEvenlopcontent;

function shareRedEvenlope(title, UrlHref, icon, content, orderid, RedEvenlopId, sendcode) {
	RedEvenlopTitle = title;
	RedEvenlopUrlHref = UrlHref;
	RedEvenlopicon = apiURL + icon;
	RedEvenlopcontent = content;
	RedEvenlopOrderId = orderid;
	ShareRedEvenlopId = RedEvenlopId;
	RedEvenlopsendCode = sendcode;
	shareData = {
		title: RedEvenlopTitle,
		href: RedEvenlopUrlHref,
		content: RedEvenlopcontent,
		imgurl: RedEvenlopicon
	};
	fxshop.removeClass(document.getElementById('shareRedEnvelop'), 'mui-hidden');
	loadShareRedEvenlop(shareData);

}

/*订单列表分享红包*/
function loadShareRedEvenlop(params) {
	var shares = initShare();
	mui('#shareRedEnvelop').on('tap', 'li', function() {
		var id = this.getAttribute('data-id');
		var scene = this.getAttribute('data-scene');
		var share = shares[id];
		if(share) {
			if(share.authenticated) {
				shareMessage(share, scene, params);
				//订单详情发送成功插入数据的记录 
				AddRedEnvelopeSendRecord(RedEvenlopOrderId, RedEvenlopsendCode, ShareRedEvenlopId);

			} else {
				share.authorize(function() {
					shareMessage(share, scene, params);
				}, function(e) {
					mui.toast("认证授权失败：" + e.code + " - " + e.message);

				});
			}
		} else {
			mui.toast("无法获取分享服务，请检查manifest.json中分享插件参数配置，并重新打包")
		}
	});

	mui('#RedEnvelopcancel').on('tap', 'a', function() {
		fxshop.addClass(document.getElementById('shareRedEnvelop'), 'mui-hidden');
	});

}

/*订单列表分享成功后插入数据库的记录*/
function AddRedEnvelopeSendRecord(orderId, sendCode, ShareRedEvenlopId) {
	mui.ajax({
		url: apiURL + "API/VshopProcess.ashx",
		type: 'post',
		dataType: 'json',
		timeout: 10000,
		data: {
			action: "AddRedEnvelopeSendRecord",
			SendCode: sendCode,
			RedEnvelopeId: ShareRedEvenlopId,
			OrderId: orderId
		},
		success: function(resultData) {
			if(resultData.success == "false") {
				mui.toast(resultData.msg);
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status + "-" + XMLHttpRequest.readyState + "-" + textStatus);
		}
	});
}

//把 Number 不四舍五入为2位小数的
function toFixed(number) {
	var numStr = number + '';
	if(numStr.indexOf(".") == -1 || numStr.indexOf(".") + 3 > numStr.length) return number.toFixed(2);
	var temp = numStr.substring(0, numStr.indexOf('.') + 3);
	return temp;
}