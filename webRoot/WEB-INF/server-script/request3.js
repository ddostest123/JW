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
	var url = args.url || '';
	var para = args.para || {};
	var _success = args['success'] || function() {
	};
	var _failure = args['failure'] || function() {
	};

	var data = para;

	// 将参数转换为MAP
	var data_map = new HashMap();
	var str = new java.lang.String(para);

	for ( var key in data) {
		var key_value = data[key];
		if (key == 'sku') {
			key_value = JSON.stringify(data[key]);
		}
		data_map.put(key, key_value);
	}
	
	// log(data_map);
	
	var ret;
	var ret_json;
	try {
		var is = Packages.aurora.plugin.util.HttpUtils.urlPost(url, data_map,
				"UTF-8");
		ret = Packages.aurora.plugin.util.IOUtilsEx.newString(is, "UTF-8");
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