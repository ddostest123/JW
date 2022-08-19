/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('asnListService', ['$http', '$filter', 'appService',

	function($http, $filter, appService) {
		var service = {
			/**
			 * 查询订单列表
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getAsnList: function(pageNum, from, queryItems, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from,
					asn_number: queryItems.asn_number,
					creation_date_from: $filter('date')(queryItems.creation_date_from, 'yyyy-MM-dd'),
					creation_date_to: $filter('date')(queryItems.creation_date_to, 'yyyy-MM-dd'),
					status: queryItems.status,
					vendor_id: queryItems.vendor_id
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.asnListUrl,
					data: parameters
				});
				return promise;
			},
			sortAsnList: function(listItems) {
					var hash = [];

					for (var i in listItems) {

						var key = 'String' + listItems[i].creation_date;
						if (hash[key] !== 1) {
							listItems[i].isFirst = true;
							listItems[i].dyHegiht = 36;
							hash[key] = 1;
						} else {
							listItems[i].dyHegiht = 0;
						}

					}

					return listItems;


				}
				
		}
		return service;
	}
]);