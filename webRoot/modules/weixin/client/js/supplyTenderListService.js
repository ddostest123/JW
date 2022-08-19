/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('supplyTenderListService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询招标列表
			 * @param from
			 * @returns {HttpPromise}
			 */
			getSupplyTenderList: function(from, user_id) {

				var parameters = encodeParameters({
					from: from
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.supplyTenderListUrl,
					data: parameters
				});
				return promise;
			}

		}
		return service;
	}
]);