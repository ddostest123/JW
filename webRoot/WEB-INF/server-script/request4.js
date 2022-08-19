importPackage(Packages.aurora.plugin.security);

importPackage(java.io);
importPackage(java.lang);
importPackage(java.util);
importPackage(Packages.aurora.plugin.util);

var logger = $logger('server-script');

function log(msg) {
	logger.info(msg);
}

function request(args) {
	if (!args)
		args = {};
	//var url = args.url || '';
	//var para = args.para || {};
	var _success = args['success'] || function() {
	};
	var _failure = args['failure'] || function() {
	};
    var url = args.url;
	var data = args.para;
    log(url)
    log(data)
	var ret;
	var ret_json;
	try {
		var is = Packages.aurora.plugin.util.HttpUtils.urlPost(url, data,
				'application/json;charset=utf8', "UTF-8");
		ret = Packages.aurora.plugin.util.IOUtilsEx.newString(is, "UTF-8");
		ret = "" + ret + "";
		ret = ret.replace(/&quot;/g, '"');
		ret = ret.substring(ret.indexOf("<return>"), ret.indexOf("</return>")+9);
		log(ret)
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
	_success(ret);
}