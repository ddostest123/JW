/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('messageListService', ['$http', 'appService',

	function($http, appService) {
		var service = {
			/**
			 * 查询订单列表
			 * @param pageNum
			 * @returns {HttpPromise}
			 */
			getMessageList: function(pageNum, from, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.messageListUrl,
					data: parameters
				});
				return promise;
			},
			
			sortMessageList: function(listItems) {
				var hash = [];

				for (var i in listItems) {

					var key = 'String' + listItems[i].release_date;
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