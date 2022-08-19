function footerRenderer_fun(records, name, percision) {
	var sum = 0;
	for ( var i = 0; i < records.length; i++) {
		var r = records[i].get(name);
		var n = parseFloat(r);
		if (!isNaN(n)) {
			sum += n;
		}
	}
	return '<font>' + sum.toFixed(percision) + '</font>';
}

function show_price_num(value, precision) {
	var tx = new String(value);
	var tx1 = tx.split('.')[1];
	if (typeof (tx1) == 'undefined') {
		return Aurora.formatNumber(value, 0);
	} else if (tx1.length < precision) {
		return Aurora.formatNumber(value, tx1.length);
	}

	return Aurora.formatNumber(value, precision);
}
/*
 * 数字保留方法
 * 根据保留的位数，不需要多位补零
 */
function show_reserver_num(value, reserver) {
	var tx = new String(value);
	var tx1 = tx.split('.')[1];
	if (typeof (tx1) == 'undefined') {
		return Aurora.formatNumber(value, 0);
	} else if (tx1.length < reserver) {
		return Aurora.formatNumber(value, tx1.length);
	}

	return Aurora.formatNumber(value, reserver);
}
/*
 * 库存事务详情页面跳转 transaction_type_code -- 业务类型 transaction_source_type --
 * 来源事务类型(当事务类型相同且页面不同时需要) header_id -- 来源事务头表
 * context_url--传${/request/@context_path}这个值
 */
function erpinv_transcation_detail_jump(transaction_type_code,
		transaction_source_type, header_id, context_url) {
	var jump_url;
	var title;
	var document_code;
	if (transaction_type_code == 'TRS-F' || transaction_type_code == 'TRS-T') {
		document_code = 'INV_TRS';
		title = "库存正常调拨";
		jump_url = "/modules/erpinv/ERPINV3010/inv_docement_trs_detail.screen";
	} else if (transaction_type_code == 'ADJ-AMT') {
		document_code = '';
		title = "库存金额调整";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_adj_amt_detail.screen";
	} else if (transaction_type_code == 'GI-F'
			|| transaction_type_code == 'GI-T') {
		if (transaction_source_type == 'INV_DOCUMENT_DELIVERY_ISS') {
			document_code = 'ORD_GI';
			title = "发出商品发出";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_issue_gi_detail.screen";
		}else if(transaction_source_type == 'INV_DOCUMENT_GOODS_ISSUE_TRS'){
			document_code = 'INV_GI';
			title = "发出商品出库(退库)";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_gi_detail.screen";
		}
	} else if (transaction_type_code == 'MI') {
		document_code = 'INV_MI';
		title = "杂项出库(退库)";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_mi_detail.screen";
	} else if (transaction_type_code == 'MOSR'
			|| transaction_type_code == 'MOIS') {
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_mosr_is_detail.screen";
	} else if (transaction_type_code == 'MPR') {
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_mpr_detail.screen";
	} else if (transaction_type_code == 'MR') {
		document_code = 'INV_MR';
		title = "杂项入库(退库)";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_mr_detail.screen";
	} else if (transaction_type_code == 'OSR' || transaction_type_code == 'PR'
			|| transaction_type_code == 'RTV' || transaction_type_code == 'OIS') {
		if(transaction_source_type == 'INV_DOCUMENT_DIRECT_RCV' && (transaction_type_code == 'PR' || transaction_type_code == 'RTV')){
			document_code = 'INV_PR';
			title = "无订单收货(退货)";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_mpr_detail.screen";
		}else if(transaction_source_type == 'INV_DOCUMENT_OUTSOURCE_MOSR' && (transaction_type_code == 'OSR' || transaction_type_code == 'OIS')){
			document_code = 'INV_OSR';
			title = "委外收货(退货)";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_mosr_is_detail.screen";
		}else{
			if(transaction_type_code == 'PR' || transaction_type_code == 'RTV'){
				document_code = 'PUR_PR';
			}else{
				document_code = 'PUR_OSR';
			}
			title = "采购接收";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_ompr_detail.screen";
		}
	} else if (transaction_type_code == 'STO' || transaction_type_code == 'COR'||transaction_type_code == 'GS'||transaction_type_code == 'GSR') {
		if (transaction_source_type == 'INV_DOCUMENT_DELIVERY_ISS') {
			document_code = 'ORD_STO';
			title = "销售发货";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_order_sto_cor_detail.screen";
		} else if (transaction_source_type == 'INV_DOCUMENT_DIRECT_ISS') {
			if(transaction_type_code == 'STO' || transaction_type_code == 'COR'){
				document_code = 'INV_STO';
			}else{
				document_code = 'INV_GS';
			}
			title = "无订单发货(退货)";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_sto_cor_detail.screen";
		}else if(transaction_source_type == 'INV_DOCUMENT_DIRECT_GR'){
			document_code = 'ORD_GS';
			title = "销售发票";
			jump_url = "/modules/erpinv/ERPINV3010/inv_document_gsr_detail.screen";
		}
	} else if (transaction_type_code == "MMI") {
		document_code = 'INV_MMI';
		title = "生产发料(退料)";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_mmi_detail.screen";
	} else if (transaction_type_code == "OTR-F"
			|| transaction_type_code == "OTR-T") {
		document_code = 'INV_OTR';
		title = "委外加工发料(退料)";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_otr_detail.screen";
	} else if (transaction_type_code == "SR") {
		document_code = 'INV_SR';
		title = "完工入库(退库)";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_sr_detail.screen";
	} else if (transaction_type_code == "UOR" || transaction_type_code == "UOI") {
		document_code = 'INV_UOR';
		title = "物品转换单";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_uori_detail.screen";
	}else if (transaction_type_code == "OB") {
		document_code = '';
		title = "期初库存";
		jump_url = "/modules/erpinv/ERPINV3010/inv_document_ob_detail.screen";
	} else {
		return;
	}
	jump_url = context_url + jump_url + '?document_header_id=' + header_id+'&document_code='+document_code;
	new Aurora.Window({
		id : 'erpinv_transcation_jump_detail_id',
		url : jump_url,
		title : title,
		fullScreen : true
	});
}