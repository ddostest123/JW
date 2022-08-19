/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('appService', [
	function() {
		var baseUrl = 'http://srmtest.haidilao.com/hdltrain/';
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
			supplyTenderParticipateUrl: baseUrl + '/modules/weixin/interface/bid/bid_participated.svc',
			supplyTenderSaveUrl: baseUrl + '/modules/weixin/interface/bid/bid_save.svc',
			supplyTenderSubmitUrl: baseUrl + '/modules/weixin/interface/bid/bid_submit.svc',
			purchaseReceiveListUrl: baseUrl + '/modules/weixin/interface/receive/receive_list.svc',
			purchaseReceiveDetailUrl: baseUrl + '/modules/weixin/interface/receive/receive_detail.svc',
			confirmReceiveUrl: baseUrl + '/modules/weixin/interface/receive/receive_confirm.svc',
			messageListUrl: baseUrl + '/modules/weixin/interface/message/message_list.svc',
			messageListDetailUrl: baseUrl + '/modules/weixin/interface/message/bulletin_detail.svc',
			vendorListUrl: baseUrl + '/modules/weixin/interface/public/vendor_list.svc'
		};
		return appService;
	}
]);