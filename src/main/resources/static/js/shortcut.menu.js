/**
 * shortcutmenu naming 은 dw_ui 의 class 중복으로 다른 모듈에서도 사용될 수 있음으로,
 * 여기 있는 펑션은 personal.shortcut.get.html.ftl 로 이전하여 전용으로 변경합니다. 
var ShortcutMenu = {
	save: function() {
		var val = [];
        $(':checkbox:checked').each(function(i){
          val[i] = $(this).attr('id');
        });
        
        var url = "/share/proxy/alfresco/global/v1/config/personal/shortcut";
        var jsonObj = {"params":val};
        callAjaxPutURL(url, jsonObj, function(resultObj) {
        	if (resultObj.success) {
        		alert(Alfresco.util.message('swp.com.confirm.saved'));
        	} else {
        		alert("Failed!!!");
        	}
        });
	}
}
 */