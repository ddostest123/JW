importPackage(Packages.aurora.plugin.security);
importPackage(Packages.snPost);
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
	var para = args.para || {};
	var _success = args['success'] || function() {
	};
	var _failure = args['failure'] || function() {
	};
	var data = JSON.stringify(para);
	var serverUrl = args.serverUrl;
	var appKey    = args.appkey;
	var appSecret = args.appscret;
	var ret;
	//var ret_json;
	try {
        var is = SnSdkEntry.SnSynEntrancePost(serverUrl, appKey, appSecret, data);
        log(is)
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
	_success(is);
}