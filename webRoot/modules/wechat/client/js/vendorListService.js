srmApp.factory('vendorListService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询供应商列表
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getVendorList: function(pageNum, from, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.vendorListUrl,
					data: parameters
				});
				return promise;
			}

		}
		return service;
	}
]);