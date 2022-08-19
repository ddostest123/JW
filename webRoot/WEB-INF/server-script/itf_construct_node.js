importPackage(Packages.aurora.plugin.security);

importPackage(java.io);
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
	var struct_bm = 'eitf.ws.public.eitf_export_structure_query';
	var running_bm = 'eitf.ws.public.eitf_instance_running';
	var packed_bm = 'eitf.ws.public.eitf_instance_packed';

	var soapResponse = new CompositeMap('soapResponse');
	// 请求列表
	var list = new ModelService(request_bm).queryAsMap().getChildren();

	// 循环送货单请求列表，封装每个请求的参数
	for ( var i = 0; i < list.length; i++) {
		var param = {
				eitf_instance_id : list[i].eitf_instance_id
			};
		// 实例运行
		$bm(running_bm).execute(param);
		// 构造record节点，存放url字段
		var record = createRecordNode('record', soapResponse, list[i].url,
				list[i].eitf_instance_id);

		// 构造request节点，并封装数据
		var request = createNode('REQUEST', record);
		// parameter：request、bg、es、itf_cate_code、itf_code、user_name、password、batch、seg、total_seg
		var header = createHeaderNode(request, list[i].interface_category_code,
				list[i].interface_code, list[i].batch_num, list[i].seg_num,
				list[i].total_seg_count);

		$ctx.parameter.interface_code = list[i].interface_code;
		$ctx.parameter.eitf_instance_id = list[i].eitf_instance_id;
		// context
		var context = createNode('CONTEXT', request);
		// asn
		var struct = new ModelService(struct_bm).queryAsMap().getChildren();
		for ( var j = 0; j < struct.length; j++) {
			var node = createNode(struct[j].node_name, context);
			createDataNode(struct[j].bm_access, node);
		}
		
		// 数据封装
		
		$bm(packed_bm).execute(param);
	}
	return soapResponse;
}
