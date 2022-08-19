/**
 * Created by titengjiang on 15/9/10.
 */
srmApp.factory('messageListDetailService', ['$http', 'appService',

	function($http, appService) {
		var service = {

			getMessageListDetail: function(from, bulletin_id, user_id) {

				var parameters = encodeParameters({
					from: from,
					bulletin_id: bulletin_id
				});

				var promise = $http({
					method: 'POST',
					headers: {
						'Content-type': "application/x-www-form-urlencoded"
					},
					url: appService.messageListDetailUrl,
					data: parameters
				});
				return promise;
			}

		}
		return service;
	}
]);