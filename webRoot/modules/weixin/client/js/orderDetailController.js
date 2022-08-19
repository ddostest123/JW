/**
 * Created by titengjiang on 15/9/8.
 */
srmApp.controller('orderDetailController', ['$scope', '$timeout', '$stateParams', '$ionicPopup', '$ionicLoading', 'orderDetailService',

	function($scope, $timeout, $stateParams, $ionicPopup, $ionicLoading, orderDetailService) {

		$scope.from = moduleName;

		$scope.headerInfo = {};

		$scope.lineInfo = [];

		$scope.pageNum = 1;

		$scope.hasMoreData = true;

		function initLoad() {
			orderDetailService.getOrderListDetail(1, $scope.from, $stateParams.item.pur_header_id)
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
			orderDetailService.getOrderListDetail($scope.pageNum, $scope.from, $stateParams.item.pur_header_id)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						if (data.result.record.lines.length > 0) {
							Array.prototype.push.apply($scope.lineInfo, data.result.record.lines);
							$scope.pageNum += 1;
						} else {
							$scope.hasMoreData = false;
						};
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
		};



		//confirm 对话框
		$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '订单确认',
				template: '是否确认订单?',
				buttons: [{
					text: '取消'
				}, {
					text: '确认',
					type: 'button-positive',
					onTap: function(e) {
						return true;
					}
				}]
			});
			confirmPopup.then(function(res) {
				if (res) {
					orderDetailService.confirmOrderListDetail($scope.from, $stateParams.item.pur_header_id)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								$stateParams.item.srm_status = '已确认';
								$stateParams.item.urgent_flag = 'N';
								$stateParams.isClickButton = true;
								$scope.operatePrompt();
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
				} else {

				}
			});
		};

		$scope.operatePrompt = function() {
			var showPopup = $ionicPopup.show({
				title: '已确认！'
			});
			$timeout(function() {
				showPopup.close();
				$timeout(function() {
					$scope.$ionicGoBack();
				}, 100);
			}, 1000);
		};

		$scope.needConfirm = function() {
			if ($stateParams.item.srm_status == '已确认') {
				return false;
			} else {
				return true;
			}
		};

		$scope.toggle = function(item) {
			if (item.expand_flag) {
				item.expand_flag = false;
			} else {
				item.expand_flag = true;
			}
		}

		$scope.show();
		initLoad();

	}
]);