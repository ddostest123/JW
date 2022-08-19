
var logger = $logger('server-script');

function log(msg) {
	logger.info(msg);
}
function request(args) {
	if (!args)
		args = {};
	var url = args.url || '';
	var para = args.para || {};
	var _success = args['success'] || function() {
	};
	var _failure = args['failure'] || function() {
	};

	var data = JSON.stringify(para);
   //JSON转string,在class下将转map.表单不识别json参数(直接的OBJ)
	//println('000'+data);
	var ret;
	var ret_json;
	try {
		var is = Packages.aurora.plugin.util.XyHttpUtils.urlPost(url,para,"UTF-8");
		ret = Packages.aurora.plugin.util.IOUtilsEx.newString(is, "UTF-8");
		ret_json=JSON.parse(String(ret));
	} catch (e) {
		_failure({
			"success" : false,
			"error" : {
				"code" : "error",
				"message" : e.message
			}
		})
		return;
	}
	_success(ret_json);
}