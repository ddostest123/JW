/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('appService', function() {
	//var baseUrl = 'http://172.20.0.125/cloudtrain';
	var baseUrl = 'http://vs125.hand-china.com/cloudtrain';
	//		var baseUrl = 'http://10.212.203.231:8885/srmcloud';
	var appService = {
		orderListUrl: baseUrl + '/modules/weixin/interface/po/po_list.svc',
		orderListDetailUrl: baseUrl + '/modules/weixin/interface/po/po_detail.svc',
		confirmOrderListUrl: baseUrl + '/modules/weixin/interface/po/po_confirm.svc',
		urgentOrderListUrl: baseUrl + '/modules/weixin/interface/po/po_urgent.svc',
		cancelUrgentOrderListUrl: baseUrl + '/modules/weixin/interface/po/po_abolish_urgent.svc',
		asnListUrl: baseUrl + '/modules/weixin/interface/asn/asn_list.svc',
		asnListDetailUrl: baseUrl + '/modules/weixin/interface/asn/asn_detail.svc',
		supplyTenderListUrl: baseUrl + '/modules/weixin/interface/bid/bid_list.svc',
		supplyTenderListDetailUrl: baseUrl + '/modules/weixin/interface/bid/bid_detail.svc',
		messageListUrl: baseUrl + '/modules/weixin/interface/message/message_list.svc',
		messageListDetailUrl: baseUrl + '/modules/weixin/interface/message/bulletin_detail.svc',
		vendorListUrl: baseUrl + '/modules/weixin/interface/public/vendor_list.svc'
	};
	return appService;
});