/**
 * Created by titengjiang on 15/9/8.
 */
srmApp.controller('messageListDetailController', ['$scope', '$timeout', '$stateParams', '$ionicPopup', '$ionicLoading', 'messageListDetailService',

	function($scope, $timeout, $stateParams, $ionicPopup, $ionicLoading, messageListDetailService) {

		$scope.from = moduleName;

		$scope.title = '';

		$scope.contents = '';

		function initLoad() {
			messageListDetailService.getMessageListDetail($scope.from, $stateParams.bulletin_id)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.title = data.result.record.title;
						$scope.contents = data.result.record.contents;
						document.getElementById('detail-contents').innerHTML = $scope.contents;
					}
					$scope.hide();
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.hide();
				})
		}

		$scope.show();
		initLoad();

	}
]);