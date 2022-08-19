/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('supplyTenderListDetailService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询投标详情
			 * @param entrustment_header_id
			 * @returns {HttpPromise}
			 */
			getSupplyTenderListDetail: function(from, header_id, company_id, user_id) {

				var parameters = encodeParameters({
					from: from,
					entrustment_header_id: header_id,
					bidder_company_id: company_id
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.supplyTenderListDetailUrl,
					data: parameters
				});
				return promise;
			},

			confirmSupplyTenderParticipate: function(from, header_id, company_id, user_id) {

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.supplyTenderParticipateUrl + '?from=' + from + '&entrustment_header_id=' + header_id + '&bidder_company_id=' + company_id
				});
				return promise;
			},

			supplyTenderSave: function(from, bid_header_id, header_id, company_id, lineInfo, user_id) {

				var bid_lines = JSON.stringify(
					lineInfo
				);

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.supplyTenderSaveUrl + '?from=' + from + '&bid_header_id=' + bid_header_id + '&entrustment_header_id=' + header_id + '&bidder_company_id=' + company_id + '&bid_lines=' + bid_lines
				});
				return promise;
			},

			supplyTenderSubmit: function(from, bid_header_id, user_id) {

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.supplyTenderSubmitUrl + '?from=' + from + '&bid_header_id=' + bid_header_id
				});
				return promise;
			}

		}

		return service;
	}
]);