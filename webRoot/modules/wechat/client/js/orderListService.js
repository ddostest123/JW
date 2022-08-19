/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('orderListService', ['$http', '$filter', 'appService',

	function($http, $filter, appService) {
		var service = {
			/**
			 * 查询订单列表
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getOrderList: function(pageNum, from, queryItems, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from,
					po_num: queryItems.po_num,
					release_date_from: $filter('date')(queryItems.release_date_from, 'yyyy-MM-dd'),
					release_date_to: $filter('date')(queryItems.release_date_to, 'yyyy-MM-dd'),
					srm_status: queryItems.srm_status,
					vendor_id: queryItems.vendor_id,
					only_urgent: queryItems.only_urgent + ""
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.orderListUrl,
					data: parameters
				});
				return promise;
			},
			sortOrderList: function(listItems) {
				var hash = [];

				for (var i in listItems) {

					var key = 'String' + listItems[i].release_date;
					if (hash[key] !== 1) {
						listItems[i].isFirst = true;
						listItems[i].dyHegiht = 38;
						hash[key] = 1;
					} else {
						listItems[i].dyHegiht = 0;
					}

				}

				return listItems;


			},

			/**
			 * 将服务器取回来的列表分类
			 * @param listItems
			 * @returns {Array}
			 */
			//	sortOrderList: function(listItems) {
			//
			//		function sortDesc(item1, item2) {
			//
			//			return item2.release_date.localeCompare(item1.release_date);
			//			//return item1.release_date - item2.release_date;
			//		}
			//
			//		var newListItems = [];
			//		var hash = [];
			//
			//		listItems.sort(sortDesc);
			//
			//		for (var i in listItems) {
			//
			//			var key = 'String' + listItems[i].release_date;
			//			if (hash[key] !== 1) {
			//				newListItems.push({
			//					release_date: listItems[i].release_date,
			//					items: []
			//				});
			//
			//				hash[key] = 1;
			//			}
			//		}
			//		newListItems.sort(sortDesc);
			//		console.log(newListItems);
			//
			//		for (var i in newListItems) {
			//
			//			for (var j in listItems) {
			//				if (listItems[j].release_date == newListItems[i].release_date) {
			//					newListItems[i].items.push(listItems[j]);
			//				}
			//			}
			//		}
			//		return newListItems;
			//	}
			//}


			/**
			 * 确认订单列表
			 * @param pur_headers
			 * @returns {HttpPromise}
			 */
			confirmOrderList: function(from, header_id, user_id) {

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
			},

			/**
			 * 整单加急
			 * @param pur_headers
			 * @returns {HttpPromise}
			 */
			urgentOrderList: function(from, header_id, user_id) {

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
					url: appService.urgentOrderListUrl + '?from=' + from + '&pur_headers=' + parameterStr
				});
				return promise;
			},

			/**
			 * 取消加急
			 * @param pur_headers
			 * @returns {HttpPromise}
			 */
			cancelUrgentOrderList: function(from, header_id, user_id) {

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
					url: appService.cancelUrgentOrderListUrl + '?from=' + from + '&pur_headers=' + parameterStr
				});
				return promise;
			}
		}
		return service;
	}
]);