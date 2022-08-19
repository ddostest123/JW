srmApp.factory('purchaseReceiveDetailService', ['$http', 'appService',

	function($http, appService) {

		var service = {

			getPurchaseReceiveDetail: function(from, po_location_id, standard_id, user_id) {

				var parameters = encodeParameters({
					from: from,
					po_location_id: po_location_id,
					standard_id: standard_id
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.purchaseReceiveDetailUrl,
					data: parameters
				});
				return promise;
			},

			confirmReceive: function(from, po_location_id, rcv_quantity, concession_quantity, user_id) {

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.confirmReceiveUrl + '?from=' + from + '&po_location_id=' + po_location_id + '&rcv_quantity=' + rcv_quantity + '&concession_quantity=' + concession_quantity
				});
				return promise;
			}

		}
		return service;
	}
]);