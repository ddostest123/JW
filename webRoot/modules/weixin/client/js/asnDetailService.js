/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('asnDetailService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询订单详情
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getAsnListDetail: function(pageNum, from, header_id, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from,
					asn_header_id: header_id
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.asnListDetailUrl,
					data: parameters
				});
				return promise;
			}

		}
		return service;
	}
]);