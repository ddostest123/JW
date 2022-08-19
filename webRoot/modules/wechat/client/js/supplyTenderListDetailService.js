/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('supplyTenderListDetailService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询订单详情
			 * @param entrustment_header_id
			 * @returns {HttpPromise}
			 */
			getSupplyTenderListDetail: function(from, header_id, user_id) {

				var parameters = encodeParameters({
					from: from,
					entrustment_header_id: header_id
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

			/**
			 * 确认订单
			 * @param entrustment_header_id
			 * @returns {HttpPromise}
			 */
			confirmSupplyTenderListDetail: function(from, header_id, user_id) {

				//				var parameters = encodeParameters({
				//					pur_headers: [{
				//						"pur_header_id": header_id
				//					}]
				//				});
				var parameterStr = JSON.stringify([{
					"pur_header_id": header_id
				}]);

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.confirmSupplyTenderListUrl + '?from=' + from + '&pur_headers=' + parameterStr
				});
				return promise;
			}

		}

		return service;
	}
]);