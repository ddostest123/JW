function request(args) {
	if (!args)
		args = {};
	var url = args.url || '';
	var para = args.para || {};
	var _success = args['success'] || function() {
	};
	var _failure = args['failure'] || function() {
	};

	var data = "_request_data=" + java.net.URLEncoder.encode(JSON.stringify({
		parameter : para
	}), "UTF-8");

	var return_data;
	try {
		var is = Packages.aurora.plugin.util.HttpUtils.urlPost(url, data,
				"UTF-8");
		return_data = Packages.aurora.plugin.util.IOUtilsEx.newString(is,
				"UTF-8");
		var return_data_json = JSON.parse(String(return_data));
		// println(return_data_json);
		_success(return_data_json);
	} catch (e) {
		_failure({
			"error" : e.message,
			"success":false
		})
	}

}