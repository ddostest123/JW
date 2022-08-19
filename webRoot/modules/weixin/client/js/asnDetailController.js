/**
 * Created by titengjiang on 15/9/8.
 */
srmApp.controller('asnDetailController', ['$scope', '$timeout', '$stateParams', '$ionicLoading', 'asnDetailService',

	function($scope, $timeout, $stateParams, $ionicLoading, asnDetailService) {

		$scope.from = moduleName;

		$scope.headerInfo = {};

		$scope.lineInfo = [];

		$scope.pageNum = 1;

		$scope.hasMoreData = true;

		function initLoad() {
			asnDetailService.getAsnListDetail(1, $scope.from, $stateParams.header_id)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.headerInfo = data.result.record.header;
						$scope.lineInfo = data.result.record.lines;
						$scope.pageNum = 2;
					}
					$scope.hide();
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.hide();
				})
		}

		$scope.loadMore = function() {
			asnDetailService.getAsnListDetail($scope.pageNum, $scope.from, $stateParams.header_id)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						if (data.result.record.lines.length > 0) {
							Array.prototype.push.apply($scope.lineInfo, data.result.record.lines);
							$scope.pageNum += 1;
						} else {
							$scope.hasMoreData = false;
						};
					}
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete')
					}, 300);
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete')
					}, 300);
				})
		};

		$scope.show();
		initLoad();

	}
]);