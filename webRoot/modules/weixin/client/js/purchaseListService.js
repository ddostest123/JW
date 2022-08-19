/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('purchaseListService', ['$http', '$filter', 'appService',

	function($http, $filter, appService) {
		var service = {
			/**
			 * 查询订单列表
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getPurchaseList: function(pageNum, from, queryItems, user_id) {

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
					url: appService.purchaseListUrl,
					data: parameters
				});
				return promise;
			},
			sortPurchaseList: function(listItems) {
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
				/**
				 *
				 * 将服务器取回来的列表分类
				 * @param listItems
				 * @returns {Array}
				 */
				//sortPurchaseList: function(listItems) {
				//
				//	function sortDesc(item1, item2) {
				//
				//		return item2.creation_date.localeCompare(item1.creation_date);
				//		//return item1.creation_date - item2.creation_date;
				//	}
				//
				//	var newListItems = [];
				//	var hash = [];
				//
				//	listItems.sort(sortDesc);
				//
				//	for (var i in listItems) {
				//
				//		var key = 'String' + listItems[i].creation_date;
				//		if (hash[key] !== 1) {
				//			newListItems.push({
				//				creation_date: listItems[i].creation_date,
				//				items: []
				//			});
				//
				//			hash[key] = 1;
				//		}
				//	}
				//	newListItems.sort(sortDesc);
				//	console.log(newListItems);
				//
				//	for (var i in newListItems) {
				//
				//		for (var j in listItems) {
				//			if (listItems[j].creation_date == newListItems[i].creation_date) {
				//				newListItems[i].items.push(listItems[j]);
				//			}
				//
				//		}
				//	}
				//	return newListItems;
				//}
		}
		return service;
	}
]);