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

function createNode(nodeName, parentNode, value) {
	var node = new CompositeMap(nodeName);
	node.setText(value);
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

function param_data(groups) {
	$ctx.parameter.groups = groups;
	var request_bm = 'eitf.ws.public.eitf_request_list';
	var lock_instance_bm = 'eitf.ws.public.lock_eitf_instance';
	var struct_bm = 'eitf.ws.public.eitf_export_structure_query';
	var running_bm = 'eitf.ws.public.eitf_instance_running';
	var packed_bm = 'eitf.ws.public.eitf_instance_packed';
	var num = 50;// 每次最大传输数量
	var count = 0;// 计数

	var soapResponse = new CompositeMap('soapResponse');
	// 请求列表
	var list = new ModelService(request_bm).queryAsMap().getChildren();

	if (list.length > 0) {
		// 随记取待发送列表中的一个BG
		var id = Math.ceil(Math.random() * list.length);
		var business_group = list[id].business_group;
		// 循环送货单请求列表，封装每个请求的参数
		for (var i = 0; i < list.length; i++) {
			if (count < 50) {
				if (list[i].business_group == business_group) {
					// 获取实例锁
					var param = {
						eitf_instance_id : list[i].eitf_instance_id
					};

					$bm(lock_instance_bm).execute(param);
					if ($ctx.parameter.is_locked == 'Y') {
						count = count + 1;
						// 实例运行
						$bm(running_bm).execute(param);
						// 构造record节点，存放url字段
						var record = createRecordNode('record', soapResponse,
								list[i].url, list[i].eitf_instance_id);

						// 构造request节点，并封装数据
						var request = createNode('REQUEST', record);
						// parameter：request、bg、es、itf_cate_code、itf_code、user_name、password、batch、seg、total_seg
						var header = createHeaderNode(request,
								list[i].interface_category_code,
								list[i].interface_code, list[i].batch_num,
								list[i].seg_num, list[i].total_seg_count);

						$ctx.parameter.interface_code = list[i].interface_code;
						$ctx.parameter.eitf_instance_id = list[i].eitf_instance_id;
						// context
						var context = createNode('CONTEXT', request);
						// asn
						var struct = new ModelService(struct_bm).queryAsMap()
								.getChildren();
						for (var j = 0; j < struct.length; j++) {
							var node = createNode(struct[j].node_name, context);
							createDataNode(struct[j].bm_access, node);
						}
						// 数据封装
						$bm(packed_bm).execute(param);
					} else {
						continue;
					}
				} else {
					break;
				}
			}
		}
	}
	return soapResponse;
}

function createResponseHeader(nodeName, response_status, response_message,
		batch_num, seg_num, total_seg_count) {
	var responseHeader = new CompositeMap(nodeName);
	var response_status = createNode("response_status", responseHeader,
			response_status);
	var response_message = createNode("response_message", responseHeader,
			response_message);
	var batch_num = createNode("batch_num", responseHeader, batch_num);
	var total_seg_count = createNode("total_seg_count", responseHeader,
			total_seg_count);
	var seg_num = createNode("seg_num", responseHeader, seg_num);

	return responseHeader;

}

function createResponse(p_eitf_instance_id, p_pack_eitf_instance_id,
		p_interface_code, p_batch_num, p_seg_num, p_total_seg_count) {
	$ctx.parameter.eitf_instance_id = p_eitf_instance_id;
	$ctx.parameter.pack_eitf_instance_id = p_pack_eitf_instance_id;
	$ctx.parameter.interface_code = p_interface_code;

	var struct_bm = 'eitf.ws.public.eitf_export_structure_query';
	var soapResponse = new CompositeMap('soapResponse');
	soapResponse.put("@success", "true");
	soapResponse.put("@xmlns", "http://www.aurora-framework.org/schema");
	var response_header = new createResponseHeader('RESPONSE_HEADER',
			'SUCCESS', '成功', p_batch_num, p_seg_num, p_total_seg_count);
	var header = new createNode(response_header, soapResponse);
	var response_context = new createNode('RESPONSE_CONTEXT', soapResponse);
	var struct = new ModelService(struct_bm).queryAsMap().getChildren();
	for (var j = 0; j < struct.length; j++) {
		var node = createNode(struct[j].node_name, response_context);
		createDataNode(struct[j].bm_access, node);
	}

	return soapResponse;
}

function createArchiveInstanceResponse(p_eitf_instance_id,
		p_pack_eitf_instance_id, p_interface_code, p_batch_num, p_seg_num,
		p_total_seg_count, p_response_status, p_response_message) {
	$ctx.parameter.eitf_instance_id = p_eitf_instance_id;
	$ctx.parameter.pack_eitf_instance_id = p_pack_eitf_instance_id;
	$ctx.parameter.interface_code = p_interface_code;

	var struct_bm = 'eitf.ws.public.eitf_export_structure_query';
	var soapResponse = new CompositeMap('soapResponse');
	soapResponse.put("@success", "true");
	soapResponse.put("@xmlns", "http://www.aurora-framework.org/schema");
	var response_header = new createResponseHeader('RESPONSE_HEADER',
			p_response_status, p_response_message, p_batch_num, p_seg_num,
			p_total_seg_count);
	var header = new createNode(response_header, soapResponse);
	var response_context = new createNode('RESPONSE_CONTEXT', soapResponse);
	var struct = new ModelService(struct_bm).queryAsMap().getChildren();
	for (var j = 0; j < struct.length; j++) {
		var node = createNode(struct[j].node_name, response_context);
		createDataNode(struct[j].bm_access, node);
	}

	return soapResponse;
}
