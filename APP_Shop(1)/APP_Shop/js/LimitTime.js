function LimitTimeShow(EndTime,nowTime) {
    showTimeList(EndTime,nowTime);
	setTimeout(function() {
		LimitTimeShow(EndTime,nowTime);
	}, 1000);    
}
//倒数时间详细页面
function showTimeList(EndTime,nowTime) {
	if (!nowTime)
        nowTime = new Date();
    var arr = EndTime.split(" ");
    var arr1 = arr[0].split("-");
    var arr2 = arr[1].split(":");
    var endData = new Date(arr1[0], (Number(arr1[1]) - 1), arr1[2], arr2[0], arr2[1], arr2[2]);
 
    // 剩余总秒
   var total = (endData - nowTime) / 1000;
        // 计算时间
        var day = parseInt(total / 86400);
        //var hour = parseInt(total / 3600);
        var hour = parseInt(total % 86400 / 3600);
        var min = parseInt((total % 3600) / 60);
        var sec = parseInt((total % 3600) % 60);
                if (day.length == 1)
            day = "0" + day;
        if (hour.length == 1)
            hour = "0" + hour;
        if (min.length == 1)
            min = "0" + min;
        if (sec.length == 1)
            sec = "0" + sec;		
		var showTime ="还剩:" + day + "天" + hour + "时" + min + "分" + sec + "秒";
		if(document.getElementById('overtime')!=null){
			document.getElementById('overtime').innerHTML=showTime;
		}
 		
}
 