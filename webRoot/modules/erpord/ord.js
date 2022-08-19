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

function show_price_num(value,precision){
    var tx = new String(value);
    var tx1 = tx.split('.')[1];
    if(typeof(tx1)=='undefined'){
        return Aurora.formatNumber(value, 0);
    }else if(tx1.length<precision){
        return Aurora.formatNumber(value,tx1.length);
    }
    
    return Aurora.formatNumber(value,precision);
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

