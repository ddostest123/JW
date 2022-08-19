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
	var url = args.url + args.para;
	var para = args.para || {};
	var _success = args['success'] || function() {
	};
	var _failure = args['failure'] || function() {
	};

	var data = para;
	log(para);
	log(url);
	/*
	 * // 将参数转换为MAP var data_map = new HashMap(); var str = new
	 * java.lang.String(para);
	 * 
	 * for ( var key in data) { var key_value = data[key]; if (key == 'sku') {
	 * key_value = JSON.stringify(data[key]); } data_map.put(key, key_value); }
	 * 
	 * //log(data_map);
	 */
	// var data = JSON.stringify(para);
	var ret;
	var ret_json;
	try {

		var is = Packages.aurora.plugin.util.HttpUtils
				.urlPost(url, '', "UTF-8");
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

function run_fun(data, record) {
	if (record.api_code == 'OMS_TOKEN') {
		var record_x = {
			'history_id' : record.history_id,
			'access_token' : data['result'][0]['access_token'],
			'refresh_token' : data['result'][0]['refresh_token'],
			'expires_in' : data['result'][0]['expires_in'],
			'time' : data['result'][0]['time']
		};
		$bm("cux.KINWONG.api.API1020.api1020_oms_token_refresh").insert(
				record_x);

	} else if (record.api_code == 'OMS_PAGENUM') {
		for ( var i in data['result']) {
			var record_x = {
				'page_num' : data['result'][i]['page_num'],
				'name' : data['result'][i]['name']
			};
			$bm("cux.KINWONG.api.API1020.api1020_oms_page").insert(record_x);
		}
	} else if (record.api_code == 'OMS_PAGESKU') {
		var arr = record.request_data.split('pageNum=');
		var arrList = data['result'].split(',');
		for (var i = 0; i < arrList.length; i++) {
			var record_x = {
				'pageno' : Number(i) + 1,
				'pagenum' : arr[1],
				'pagecount' : arrList.length,
				'skuids' : arrList[i]
			};
			$bm("cux.KINWONG.api.API1020.api1020_oms_page_product").insert(
					record_x);
		}
	} else if (record.api_code == 'OMS_PRODUCT_DETAIL'
			|| record.API_CODE == 'OMS_PRODUCT_DETAIL_MS') {
		for ( var i in data['result']) {
			if (data['result'][i] == null) {
				data['result'][i] = '';
			}
		}
		var record_x = {
			'sku' : data['result']['sku'],
			'name' : data['result']['name'],
			'sale_unit' : data['result']['saleUnit'],
			'weight' : data['result']['weight'],
			'product_area' : data['result']['productArea'],
			'upc' : data['result']['upc'],
			'ware_qd' : data['result']['wareQD'],
			'image_path' : data['result']['imagePath'],
			'param' : data['result']['param'],
			'state' : data['result']['state'],
			'brand_name' : data['result']['brandName'],
			'brand_pic' : '',
			'moq' : '',
			'mfg_sku' : '',
			'delivery_time' : '',
			'isreturn' : '',
			'introduction' : data['result']['introduction'],
			'category_id' : data['result']['category'],
			'relatedsku' : data['result']['relatedSku'],
			'replacedsku' : data['result']['replacedSku']
		}
		$bm("cux.KINWONG.api.API1020.api1020_oms_detail").insert(record_x);
	} else if (record.api_code == 'OMS_PRODUCT_IMAGE') {
		if (data['result'].length > 0) {
			for ( var i in data['result']) {
				var record_x = {
					'skuid' : String(Object.keys(data['result'][i])),
					'path' : String(data['result'][i][Object
							.keys(data['result'][i])][0]['path']),
					'isprimary' : String(data['result'][i][Object
							.keys(data['result'][i])][0]['isPrimary']),
					'ordersort' : String(data['result'][i][Object
							.keys(data['result'][i])][0]['orderSort'])
				};
				$bm("cux.KINWONG.api.API1020.api1020_oms_image").insert(
						record_x);
			}
		}
	} else if (record.api_code == 'OMS_SELL_PRICE'
			|| record.API_CODE == 'OMS_SELL_PRICE_MS') {
		for ( var i in data['result']) {
			var record_x = {
				'sku' : data['result'][i]['skuId'],
				'price' : data['result'][i]['bizPrice'],
				'ecprice' : data['result'][i]['supplierPrice']
			};
			$bm("cux.KINWONG.api.API1020.api1020_oms_price").insert(record_x);
		}
		// for ( var i in data['result']) {
		// var record_x = {
		// 'sku' : data['result'][i]['sku'],
		// 'price' : data['result'][i]['bizNakedPrice'],
		// 'ecprice' : data['result'][i]['price']
		// };
		// $bm("cux.KINWONG.api.API1020.api1020_oms_price").insert(record_x);
		// }
	}

	else if (record.api_code == 'OMS_GET_MESSAGE') {
		for ( var i in data['result']) {
			var result = JSON.stringify(data['result'][i]['result']);
			var record_x = {
				'id' : data['result'][i]['id'],
				'time' : data['result'][i]['time'],
				'type' : data['result'][i]['type'],
				'result' : result
			};
			$bm("cux.KINWONG.api.API1020.api1020_oms_message").insert(record_x);
		}
	} else if (record.API_CODE == 'OMS_SUBMIT_ORDER') {
		var record_x = {
			'order_num' : data['result']['supplierOrderId'],
			'req_header_id' : $ctx.parameter.req_header_id
		};
		$bm("cux.KINWONG.api.API1020.api1020_oms_req_order_query").insert(
				record_x);
	} else if (record.API_CODE == 'OMS_QUERY_SUB_ORDER') {
		var corder = data['result']['cOrder'];
		var porder = data['result']['pOrder'];
		if (corder.length == 0) {
			var record_x = {
				'eb_order_id' : porder.supplierOrderId,
				'parent_eb_order_id' : 0,
				'data_source' : 'OMS',
				'type' : data['result']['type']
			};
			$bm("cux.KINWONG.api.API1020.api1020_oms_query_sub_order").insert(
					record_x);
		} else if (corder.length > 0) {
			for (i = 0; i < corder.length; i++) {
				var record_x = {
					'eb_order_id' : corder[i]['supplierOrderId'],
					'parent_eb_order_id' : corder[i]['pOrder'],
					'data_source' : 'OMS',
					'type' : data['result']['type']
				};
				$bm("cux.KINWONG.api.API1020.api1020_oms_query_sub_order")
						.insert(record_x);
			}
		}
	}
}