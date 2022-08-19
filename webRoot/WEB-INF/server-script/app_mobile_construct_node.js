importPackage(Packages.aurora.plugin.security);

importPackage(java.io);
importPackage(java.util);
importPackage(Packages.aurora.plugin.util)

var logger = $logger('server-script');

function log(msg) {
	logger.info(msg);
}

function createNode(nodeName) {
	var node = new CompositeMap(nodeName);
	return node;
}

function createNode(nodeName, parentNode) {
	log(parentNode.toXML());
	var node = new CompositeMap(nodeName);
	parentNode.addChild(node);
	return node;
}

function createNode(nodeName, parentNode, value) {
	var node = new CompositeMap(nodeName);
	node.setText(value);
	parentNode.addChild(node);
	return node;
}

function createRecordNode(nodeName, value) {
	var node = new CompositeMap(nodeName);
	node.put('@url', value);
	return node;
}

function createRecordNode(nodeName, parentNode, value, value1) {
	var node = new CompositeMap(nodeName);
	node.put('@url', value);
	node.put('@eitf_instance_id', value1);
	parentNode.addChild(node);
	return node;
}

function createDataNode(dataBm, parentNode) {
	var dataMap = new ModelService(dataBm).queryAsMap();
	var node = new CompositeMap(dataMap);
	parentNode.addChild(node);
}

function createResponseHeader(nodeName, response_status, response_message) {
	var responseHeader = new CompositeMap(nodeName);
	var v_response_status = createNode("RESPONSE_STATUS", responseHeader,
			response_status);
	var v_response_message = createNode("RESPONSE_MESSAGE", responseHeader,
			response_message);

	return responseHeader;

}

function createResponseContext(nodeName, struct_bm, data_param) {
	var responseContext = new CompositeMap(nodeName);
	var struct = new ModelService(struct_bm).queryAsMap(data_param)
			.getChildren();
	for (var j = 0; j < struct.length; j++) {
		var node = createNode(struct[j].node_name, responseContext);
		createDataNode(struct[j].bm_access, node);
	}
	return responseContext;
}

function createResponse(data_param, response_status, reponse_message) {
	var soapResponse = new CompositeMap('soapResponse');

	soapResponse.put("@success", "true");
	soapResponse.put("@xmlns", "http://www.aurora-framework.org/schema");

	if (data_param.option_code) {
		var struct_bm = 'app.main.app_option_structure_query';
		var responseContext = createResponseContext("RESPONSE_CONTEXT",
				struct_bm, data_param);

		soapResponse.addChild(responseContext);
	}

	var responseHeader = createResponseHeader("RESPONSE_HEADER",
			response_status, reponse_message);

	soapResponse.addChild(responseHeader);

	return soapResponse;
}

function app_instance_runing(data_param) {
		var soapResponse = createResponse(data_param, "SUCCESS", "成功");
	
	return soapResponse;
}

//推送消息
function app_message_auto_push() {
	var soapResponse = new CompositeMap('soapResponse');
	var request_bm = 'app.fnd.app_mobile_message_instance_create';
	  var push_user = 'app.fnd.app_mobile_message_instance_push_user';
	
	soapResponse.put("@xmlns:soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
	soapResponse.put("@xmlns:sch", "http://www.aurora-framework.org/schema");
	

	// 构造request节点，并封装数据
	var header = createNode('HEADER', soapResponse);
    //var body = createNode('BODY', header);
    var request = createNode('REQUEST', header);
	

	// 实例运行
    var message = createNode('MESSAGE', request);
    createDataNode(request_bm, message);

      var user = createNode('USERS', request);
    createDataNode(push_user, user);
	
   return soapResponse;
}

//推送用户
function app_platfrom_user_auto_push() {
	var soapResponse = new CompositeMap('soapResponse');
	var request_bm = 'app.main.app_mobile_platform_user_query';
	
	//soapResponse.put("@xmlns:soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
	//soapResponse.put("@xmlns:sch", "http://www.aurora-framework.org/schema");
	

	// 构造request节点，并封装数据
	var header = createNode('HEADER', soapResponse);
    //var body = createNode('BODY', header);
    var request = createNode('REQUEST', header);
	

	// 实例运行
      var user = createNode('USERS', request);
    createDataNode(request_bm, user);
	
    //log("soapResponse.toXML()：" + soapResponse.toXML());
   return soapResponse;
}