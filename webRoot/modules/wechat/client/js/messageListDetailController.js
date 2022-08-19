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
					$scope.title = data.result.record.title;
					$scope.contents = data.result.record.contents;
					document.getElementById('detail-contents').innerHTML = $scope.contents;
				}).error(function(data, status, headers, config) {

				})
		}

		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		$timeout(function() {
			$ionicLoading.hide();
			initLoad();
		}, 1000);

	}
]);