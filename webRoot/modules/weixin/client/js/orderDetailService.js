/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('orderDetailService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询订单详情
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getOrderListDetail: function(pageNum, from, header_id, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from,
					pur_header_id: header_id
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.orderListDetailUrl,
					data: parameters
				});
				return promise;
			},

			/**
			 * 确认订单
			 * @param pur_headers
			 * @returns {HttpPromise}
			 */
			confirmOrderListDetail: function(from, header_id, user_id) {

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
					url: appService.confirmOrderListUrl + '?from=' + from + '&pur_headers=' + parameterStr
				});
				return promise;
			}

		}

		return service;
	}
]);