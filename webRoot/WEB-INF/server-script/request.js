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
	var ret;
	log(data);
	log(url);
	try {
		var is = Packages.com.hand.jw_webservice.HttpUtils.urlPost(url, para,
				"application/json;charset=utf-8", "UTF-8", "", "");
		ret = Packages.com.hand.jw_webservice.IOUtilsEx.newString(is, "UTF-8");
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

function run_fun(data, record) {
	if (record.api_code == 'XY_TOKEN') {
		var record_x = {
			'history_id' : record.history_id,
			'access_token' : data['result']['access_token'],
			'refresh_token' : data['result']['refresh_token'],
			'expires_in' : data['result']['expires_in'],
			'time' : data['result']['time']
		};
		$bm("cux.KINWONG.api.API1010.api1010_xy_token_get").insert(record_x);
	} else if (record.api_code == 'XY_REFRESH_TOKEN') {
		var record_x = {
			'history_id' : record.history_id,
			'access_token' : data['result']['access_token'],
			'expires_in' : data['result']['expires_in'],
			'time' : data['result']['time']
		};
		$bm("cux.KINWONG.api.API1010.api1010_xy_refresh_token")
				.insert(record_x);
	} else if (record.api_code == 'XY_PAGENUM') {
		var result_map = getMap('cux.KINWONG.api.API1010.api1010_xy_pagenum',
				'PAGE_NUM', 'NAME');
		for (var i = 0; i < data['result'].length; i++) {
			if (!result_map[data['result'][i]['page_num']]) {
				var record_x = {
					'page_num' : data['result'][i]['page_num'],
					'name' : data['result'][i]['name']
				};
				$bm("cux.KINWONG.api.API1010.api1010_xy_pagenum").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'XY_PAGESKU') {
		var request_date = JSON.parse(record.request_data);
		if (data['result']['skuIds'].length == 0) {
			var record_x = {
				'pageno' : request_date['pageNo'],
				'pagenum' : request_date['pageNum'],
				'pageCount' : data['result']['pageCount']
			};
			$bm("cux.KINWONG.api.API1010.api1010_xy_product_sku").insert(
					record_x);
		} else {
			for (var i = 0; i < data['result']['skuIds'].length; i++) {
				var record_x = {
					'pageno' : request_date['pageNo'],
					'pagenum' : request_date['pageNum'],
					'pageCount' : data['result']['pageCount'],
					'skuIds' : data['result']['skuIds'][i]
				};
				$bm("cux.KINWONG.api.API1010.api1010_xy_product_sku").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'XY_PRODUCT_DETAIL'
			|| record.API_CODE == 'XY_PRODUCT_DETAIL_MS') {
		var category = '';
		for ( var ca in data['result']['category']) {
			if (ca != 0) {
				category = category + ',';
			}
			category = category + data['result']['category'][ca];
		}
		category = String(category);
		if (!data['result']['category']
				|| (data['result']['category'].length < 3)) {
			return;
		} else {
			var record_x = {
				'sku' : data['result']['sku'],
				'state' : data['result']['state'],
				'pageCount' : data['result']['pageCount'],
				'name' : data['result']['name'],
				'category' : category,
				'sale_unit' : data['result']['saleUnit'],
				'weight' : data['result']['weight'],
				'product_area' : data['result']['productArea'],
				'upc' : data['result']['upc'],
				'ware_qd' : data['result']['wareQD'],
				'image_path' : data['result']['imagePath'],
				'param' : JSON.stringify(data['result']['param']),
				'brand_name' : data['result']['brandName'],
				'brand_pic' : data['result']['brandPic'],
				'moq' : data['result']['moq'],
				'mfg_sku' : data['result']['mfgSku'],
				'delivery_time' : data['result']['deliveryTime'],
				'isreturn' : data['result']['isReturn'],
				'introduction' : data['result']['introduction'],
				'category_id' : data['result']['category'][2]
			};
			for ( var i in record_x) {
				if (record_x[i] == null) {
					record_x[i] = '';
				}
			}
			$bm("cux.KINWONG.api.API1010.api1010_xy_product_detail").insert(
					record_x);
		}
	} else if (record.api_code == 'XY_PRODUCT_IMAGE') {
		var size = [ 'A', 'B', 'C' ];
		for ( var i in data['result']) {
			var path = data['result'][i]['skuPic'][0]['path'].split(',');
			for ( var j in path) {
				var record_x = {
					'skuid' : data['result'][i]['sku'],
					'path' : path[j],
					'isprimary' : data['result'][i]['skuPic'][0]['isPrimary'],
					'ordersort' : data['result'][i]['skuPic'][0]['orderSort'],
					'pic_size' : size[j]
				};
				$bm("cux.KINWONG.api.API1010.api1010_xy_image")
						.insert(record_x);
			}

		}
	} else if (record.api_code == 'XY_SELL_PRICE'
			|| record.API_CODE == 'XY_SELL_PRICE_MS') {
		for ( var i in data['result']) {
			var record_x = {
				'sku' : data['result'][i]['skuId'],
				'price' : data['result'][i]['price'],
				'ecPrice' : data['result'][i]['ecPrice']
			};
			$bm("cux.KINWONG.api.API1010.api1010_xy_sell_price").insert(
					record_x);
		}
	} else if (record.api_code == 'XY_GET_MESSAGE') {
		var result_map = getMap('cux.KINWONG.api.API1010.api1010_xy_message',
				'ID', 'TYPE');
		for ( var i in data['result']) {
			if (!result_map[data['result'][i]['id']]) {
				var result = JSON.stringify(data['result'][i]['result']);
				var record_x = {
					'id' : data['result'][i]['id'],
					'time' : data['result'][i]['time'],
					'type' : data['result'][i]['type'],
					'result' : result
				};
				$bm("cux.KINWONG.api.API1010.api1010_xy_message").insert(
						record_x);
			}
		}
	} else if (record.API_CODE == 'XY_SUBMIT_ORDER') {
		var record_x = {
			'order_num' : data['result']['orderId'],
			'req_header_id' : $ctx.parameter.req_header_id
		};
		$bm("cux.KINWONG.api.API1010.api1010_xy_req_order_query").insert(
				record_x);
	} else if (record.api_code == 'ZKH_TOKEN') {
		var record_x = {
			'history_id' : record.history_id,
			'access_token' : data['result']['access_token'],
			'refresh_token' : '',
			'expires_in' : data['result']['expires_in'],
			'time' : data['result']['time']
		};
		$bm("cux.KINWONG.api.API1030.api1030_zkh_token").insert(record_x);
	} else if (record.api_code == 'ZKH_PAGENUM') {
		var result_map = getMap('cux.KINWONG.api.API1030.api1030_zkh_pagenum',
				'PAGE_NUM', 'NAME');
		for (var i = 1; i < data['result'].length; i++) {
			if (!result_map[data['result'][i]['page_num']]) {
				var record_x = {
					'page_num' : data['result'][i]['page_num'],
					'name' : data['result'][i]['name']
				};
				$bm("cux.KINWONG.api.API1030.api1030_zkh_pagenum").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'ZKH_PAGESKU') {
		var request_date = JSON.parse(record.request_data);
		if (data['result']['skuIds'].length == 0) {
			var record_x = {
				'pageno' : request_date['pageNo'],
				'pagenum' : request_date['pageNum'],
				'pageCount' : data['result']['pageCount']
			};
			$bm("cux.KINWONG.api.API1030.api1030_zkh_product_sku").insert(
					record_x);
		} else {
			for (var i = 0; i < data['result']['skuIds'].length; i++) {
				var record_x = {
					'pageno' : request_date['pageNo'],
					'pagenum' : request_date['pageNum'],
					'pageCount' : data['result']['pageCount'],
					'skuIds' : data['result']['skuIds'][i]
				};
				$bm("cux.KINWONG.api.API1030.api1030_zkh_product_sku").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'ZKH_PRODUCT_DETAIL'
			|| record.API_CODE == 'ZKH_PRODUCT_DETAIL_MS') {
		var category = '';
		for ( var ca in data['result']['category']) {
			if (ca != 0) {
				category = category + ',';
			}
			category = category + data['result']['category'][ca];
		}
		category = String(category);
		var record_x = {
			'sku' : data['result']['sku'],
			'state' : data['result']['state'],
			'pageCount' : data['result']['pageCount'],
			'name' : data['result']['name'],
			'category' : category,
			'sale_unit' : data['result']['saleUnit'],
			'weight' : data['result']['weight'],
			'product_area' : data['result']['productArea'],
			'upc' : data['result']['upc'],
			'ware_qd' : data['result']['wareQD'],
			'image_path' : data['result']['imagePath'],
			'param' : JSON.stringify(data['result']['param']),
			'brand_name' : data['result']['brandName'],
			'brand_pic' : data['result']['brandPic'],
			'moq' : data['result']['moq'],
			'mfg_sku' : data['result']['mfgSku'],
			'delivery_time' : data['result']['deliveryTime'],
			'isreturn' : data['result']['isReturn'],
			'introduction' : data['result']['introduction'],
			'category_id' : data['result']['category'][3]
		};
		for ( var i in record_x) {
			if (record_x[i] == null) {
				record_x[i] = '';
			}
		}
		$bm("cux.KINWONG.api.API1030.api1030_zkh_product_detail").insert(
				record_x);
	} else if (record.api_code == 'ZKH_PRODUCT_IMAGE') {
		for ( var i in data['result']) {
			for ( var j in data['result'][i]['skuPic']) {
				var record_x = {
					'skuid' : data['result'][i]['sku'],
					'path' : data['result'][i]['skuPic'][j]['path'],
					'isprimary' : data['result'][i]['skuPic'][j]['isPrimary'],
					'ordersort' : data['result'][i]['skuPic'][j]['orderSort'],
					'pic_size' : ''
				};
				$bm("cux.KINWONG.api.API1030.api1030_zkh_image").insert(
						record_x);
			}

		}
	} else if (record.api_code == 'ZKH_SELL_PRICE'
			|| record.API_CODE == 'ZKH_SELL_PRICE_MS') {
		for ( var i in data['result']) {
			var record_x = {
				'sku' : data['result'][i]['skuId'],
				'price' : data['result'][i]['price'],
				'ecprice' : data['result'][i]['ecPrice']
			};
			$bm("cux.KINWONG.api.API1030.api1030_zkh_sell_price").insert(
					record_x);
		}
	} else if (record.api_code == 'ZKH_GET_MESSAGE') {
		var result_map = getMap('cux.KINWONG.api.API1030.api1030_zkh_message',
				'ID', 'TYPE');
		for ( var i in data['result']) {
			if (!result_map[data['result'][i]['id']]) {
				var result = JSON.stringify(data['result'][i]['result']);
				var record_x = {
					'id' : data['result'][i]['id'],
					'time' : data['result'][i]['time'],
					'type' : data['result'][i]['type'],
					'result' : result
				};
				$bm("cux.KINWONG.api.API1030.api1030_zkh_message").insert(
						record_x);
			}
		}
	} else if (record.API_CODE == 'ZKH_SUBMIT_ORDER') {
		var record_x = {
			'order_num' : data['result']['orderId'],
			'req_header_id' : $ctx.parameter.req_header_id
		};
		$bm("cux.KINWONG.api.API1030.api1030_zkh_req_order_query").insert(
				record_x);

	} else if (record.API_CODE == 'ZKH_QUERY_SUB_ORDER') {
		var cOrder = data['result']['cOrder'];
		var porder = data['result']['porder'];
		if (cOrder.length == 0) {
			var record_x = {
				'eb_order_id' : porder.orderid,
				'parent_eb_order_id' : 0,
				'data_source' : 'ZKH',
				'type' : data['result']['type']
			};
			$bm("cux.KINWONG.api.API1040.api1040_gaj_query_sub_order").insert(
					record_x);
		} else if (cOrder.length > 0) {
			for (i = 0; i < cOrder.length; i++) {
				var record_x = {
					'eb_order_id' : cOrder[i]['orderId'],
					'parent_eb_order_id' : cOrder[i]['pOrder'],
					'data_source' : 'ZKH',
					'type' : data['result']['type']
				};
				$bm("cux.KINWONG.api.API1040.api1040_gaj_query_sub_order")
						.insert(record_x);
			}
		}
	} else if (record.api_code == 'GAJ_TOKEN') {
		var record_x = {
			'history_id' : record.history_id,
			'access_token' : data['result']['Access_token'],
			'refresh_token' : data['result']['Refresh_token'],
			'expires_in' : data['result']['expires_in'],
			'time' : data['result']['time']
		};
		$bm("cux.KINWONG.api.API1040.api1040_gaj_token").insert(record_x);
	} else if (record.api_code == 'GAJ_PAGENUM') {
		var result_map = getMap('cux.KINWONG.api.API1040.api1040_gaj_pagenum',
				'PAGE_NUM', 'NAME');
		for (var i = 0; i < data['result'].length; i++) {
			if (!result_map[data['result'][i]['page_num']]) {
				var record_x = {
					'page_num' : data['result'][i]['page_num'],
					'name' : data['result'][i]['name']
				};
				$bm("cux.KINWONG.api.API1040.api1040_gaj_pagenum").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'GAJ_PAGESKU') {
		var request_date = JSON.parse(record.request_data);
		if (data['result']['skuIds'].length == 0) {
			var record_x = {
				'pageno' : request_date['pageNo'],
				'pagenum' : request_date['pageNum'],
				'pageCount' : data['result']['pageCount']
			};
			$bm("cux.KINWONG.api.API1040.api1040_gaj_product_sku").insert(
					record_x);
		} else {
			for (var i = 0; i < data['result']['skuIds'].length; i++) {
				var record_x = {
					'pageno' : request_date['pageNo'],
					'pagenum' : request_date['pageNum'],
					'pageCount' : data['result']['pageCount'],
					'skuIds' : data['result']['skuIds'][i]
				};
				$bm("cux.KINWONG.api.API1040.api1040_gaj_product_sku").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'GAJ_PRODUCT_DETAIL'
			|| record.API_CODE == 'GAJ_PRODUCT_DETAIL_MS') {
		var category = '';
		for ( var ca in data['result']['category']) {
			if (ca != 0) {
				category = category + ',';
			}
			category = category + data['result']['category'][ca];
		}
		category = String(category);
		var record_x = {
			'sku' : data['result']['sku'],
			'state' : data['result']['state'],
			// 'pageCount' : data['result']['pageCount'],
			'name' : data['result']['name'],
			'category' : category,
			'sale_unit' : data['result']['saleUnit'],
			// 'weight' : data['result']['weight'],
			// 'product_area' : data['result']['productArea'],
			// 'upc' : data['result']['upc'],
			'ware_qd' : data['result']['wareQD'],
			'image_path' : data['result']['imagePath'],
			'param' : JSON.stringify(data['result']['param']),
			'brand_name' : data['result']['brandName'],
			// 'brand_pic' : data['result']['brandPic'],
			'moq' : data['result']['moq'],
			'mfg_sku' : data['result']['mfgSku'],
			'delivery_time' : data['result']['deliveryTime'],
			'isreturn' : data['result']['isReturn'],
			'introduction' : data['result']['introduction'],
			'category_id' : data['result']['category'][3],
			'gaj_group' : data['result']['group'],
			'warenum' : data['result']['wareNum']
		};
		for ( var i in record_x) {
			if (record_x[i] == null) {
				record_x[i] = '';
			}
		}
		$bm("cux.KINWONG.api.API1040.api1040_gaj_product_detail").insert(
				record_x);
	} else if (record.api_code == 'GAJ_PRODUCT_IMAGE') {
		for ( var i in data['result']) {
			var length = data['result'][i]['skuPic'];
			if (length != 0) {
				var record_x = {
					'skuid' : data['result'][i]['sku'],
					'path' : data['result'][i]['skuPic'][0]['path'],
					'isprimary' : data['result'][i]['skuPic'][0]['isPrimary'],
					'ordersort' : data['result'][i]['skuPic'][0]['orderSort'],
					'pic_size' : null
				};
				$bm("cux.KINWONG.api.API1040.api1040_gaj_image").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'GAJ_SELL_PRICE'
			|| record.API_CODE == 'GAJ_SELL_PRICE_MS') {
		for ( var i in data['result']) {
			var record_x = {
				'sku' : data['result'][i]['skuId'],
				'price' : data['result'][i]['price'],
				'ecPrice' : data['result'][i]['ecPrice']
			};
			$bm("cux.KINWONG.api.API1040.api1040_gaj_sell_price").insert(
					record_x);
		}
	} else if (record.api_code == 'GAJ_GET_MESSAGE') {
		var result_map = getMap('cux.KINWONG.api.API1040.api1040_gaj_message',
				'ID', 'TYPE');
		for ( var i in data['result']) {
			if (!result_map[data['result'][i]['id']]) {
				var result = JSON.stringify(data['result'][i]['result']);
				var record_x = {
					'id' : data['result'][i]['id'],
					'time' : data['result'][i]['time'],
					'type' : data['result'][i]['type'],
					'result' : result
				};
				$bm("cux.KINWONG.api.API1040.api1040_gaj_message").insert(
						record_x);
			}
		}
	} else if (record.API_CODE == 'GAJ_SUBMIT_ORDER') {
		var record_x = {
			'order_num' : data['result']['orderId'],
			'req_header_id' : $ctx.parameter.req_header_id
		};
		$bm("cux.KINWONG.api.API1040.api1040_gaj_req_order_query").insert(
				record_x);
	} else if (record.API_CODE == 'GAJ_ORDER_QUERY') {
		var cOrder = data['result']['cOrder'];
		var pOrder = data['result']['pOrder'];
		if (cOrder.length == 0) {
			var record_x = {
				'eb_order_id' : pOrder.orderId,
				'parent_eb_order_id' : 0,
				'data_source' : 'GAJ',
				'type' : data['result']['type']
			};
			$bm("cux.KINWONG.api.API1040.api1040_gaj_query_sub_order").insert(
					record_x);
		} else if (cOrder.length > 0) {
			for (i = 0; i < cOrder.length; i++) {
				var record_x = {
					'eb_order_id' : cOrder[i]['orderId'],
					'parent_eb_order_id' : cOrder[i]['pOrder'],
					'data_source' : 'GAJ',
					'type' : data['result']['type']
				};
				$bm("cux.KINWONG.api.API1040.api1040_gaj_query_sub_order")
						.insert(record_x);
			}
		}
	}
}

function getMap(bm, key, value) {
	var bm = new ModelService(bm);
	bm.fetchDescriptor = {
		pagesize : 3,
		pagenum : 2,
		fetchAll : true
	};
	var res = bm.queryAsMap();
	var arr = res.getChildren();
	var result_map = {};
	for (var i = 0; i < arr.length; i++) {
		result_map[arr[i][key] + ''] = arr[i][value];
	}
	return result_map;
}
