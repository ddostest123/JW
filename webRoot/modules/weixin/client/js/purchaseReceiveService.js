srmApp.factory('purchaseReceiveService', ['$http', 'appService',

	function($http, appService) {

		var service = {

			getPurchaseReceiveList: function(pageNum, from, searchNumber, user_id) {

				var parameters = encodeParameters({
					pagenum: pageNum,
					from: from,
					po_asn_number: searchNumber
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.purchaseReceiveListUrl,
					data: parameters
				});
				return promise;
			}

		}
		return service;
	}
]);