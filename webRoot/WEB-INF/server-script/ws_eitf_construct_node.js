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

function createHeaderNode(request, interface_category_code, interface_code,
		batch_num, seg_num, total_seg_count) {
	var header = createNode('HEADER', request);
	var interface_category_code = createNode('INTERFACE_CATEGORY_CODE', header,
			interface_category_code);
	var interface_code = createNode('INTERFACE_CODE', header, interface_code);
	var batch_num = createNode('BATCH_NUM', header, batch_num);
	var seg_num = createNode('SEG_NUM', header, seg_num);
	var total_seg_count = createNode('TOTAL_SEG_COUNT', header, total_seg_count);
	return header;
}

function createResponseHeader(nodeName, batch_num, seg_num, total_seg_count) {
	var responseHeader = new CompositeMap(nodeName);
	var batch_num = createNode("BATCH_NUM", responseHeader, batch_num);
	var seg_num = createNode("SEG_NUM", responseHeader, seg_num);
	var total_seg_count = createNode("TOTAL_SEG_COUNT", responseHeader,
			total_seg_count);

	return responseHeader;

}

function createResponseHeader(nodeName, batch_num, seg_num, total_seg_count,
		response_status, response_message) {
	var responseHeader = new CompositeMap(nodeName);
	var batch_num = createNode("BATCH_NUM", responseHeader, batch_num);
	var seg_num = createNode("SEG_NUM", responseHeader, seg_num);
	var total_seg_count = createNode("TOTAL_SEG_COUNT", responseHeader,
			total_seg_count);
	var v_response_status = createNode("RESPONSE_STATUS", responseHeader,
			response_status);
	var v_response_message = createNode("RESPONSE_MESSAGE", responseHeader,
			response_message);

	return responseHeader;

}

function createResponseContext(nodeName, struct_bm, eitf_instance_id,
		pack_eitf_instance_id, interface_code) {
	var responseContext = new CompositeMap(nodeName);
	$ctx.parameter.eitf_instance_id = eitf_instance_id;
	$ctx.parameter.pack_eitf_instance_id = pack_eitf_instance_id;
	$ctx.parameter.interface_code = interface_code;

	var struct = new ModelService(struct_bm).queryAsMap().getChildren();
	for (var j = 0; j < struct.length; j++) {
		var node = createNode(struct[j].node_name, responseContext);
		createDataNode(struct[j].bm_access, node);
	}
	return responseContext;
}

function createResponse(eitf_instance_id, pack_eitf_instance_id,
		interface_code, batch_num, seg_num, total_seg_count, response_status,
		reponse_message) {
	var soapResponse = new CompositeMap('soapResponse');

	soapResponse.put("@success", "true");
	soapResponse.put("@xmlns", "http://www.aurora-framework.org/schema");

	if (eitf_instance_id && pack_eitf_instance_id) {
		var struct_bm = 'eitf.ws.public.eitf_export_structure_query';

		var responseContext = createResponseContext("RESPONSE_CONTEXT",
				struct_bm, eitf_instance_id, pack_eitf_instance_id,
				interface_code);

		soapResponse.addChild(responseContext);
	}

	var responseHeader = createResponseHeader("RESPONSE_HEADER", batch_num,
			seg_num, total_seg_count, response_status, reponse_message);

	soapResponse.addChild(responseHeader);

	return soapResponse;
}

function eitf_export_instances_checks(interface_code, batch_num, seg_num,
		total_seg_count) {

	var existsArchiveInstancesBm = "ws_eitf.PUBLIC.exists_archive_instances";
	var existsInstancesBm = "ws_eitf.PUBLIC.exists_export_instances";

	$bm(existsArchiveInstancesBm).execute();

	if ($ctx.parameter.exists_flag == 'Y') {
		$ctx.parameter.finished = 'Y';
		var soapResponse = createResponse('', '', interface_code, batch_num,
				seg_num, total_seg_count, "SUCCESS",
				"It Has been Confirmed Successfully !");
	} else {
		$bm(existsInstancesBm).execute();

		if ($ctx.parameter.total_seg_count == 0) {
			$ctx.parameter.finished = 'Y';
			var soapResponse = createResponse('', '', interface_code,
					batch_num, seg_num, 0, "SUCCESS", "No Data Founded !");
		} else {
			$ctx.parameter.finished = 'N';
		}
	}

	return soapResponse;
}

function ws_eitf_instance_runing() {
/*
	log("eitf_instance_id:" + $ctx.parameter.eitf_instance_id);
	log("interface_code:" + $ctx.parameter.interface_code);
	log("batch_num:" + $ctx.parameter.batch_num);
	log("seg_num:" + $ctx.parameter.seg_num);
	log("total_seg_count:" + $ctx.parameter.total_seg_count);
	log("flag:" + $ctx.parameter.flag);
*/
	if ($ctx.parameter.flag == 'N') {
		var soapResponse = createResponse('', '',
				$ctx.parameter.interface_code, '', '', 0, "SUCCESS",
				"No Data Founded !");
	} else {
		// 实例启动
		$bm('ws_eitf.PUBLIC.eitf_export_start').execute();
		var soapResponse = createResponse($ctx.parameter.eitf_instance_id,
				$ctx.parameter.eitf_instance_id, $ctx.parameter.interface_code,
				$ctx.parameter.batch_num, $ctx.parameter.seg_num,
				$ctx.parameter.total_seg_count, "SUCCESS",
				"SEND SUCCESSFULLY !");
		$bm('ws_eitf.PUBLIC.eitf_instance_send').execute();
	}

	return soapResponse;
}
