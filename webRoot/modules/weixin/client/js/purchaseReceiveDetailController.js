srmApp.controller('purchaseReceiveDetailController', ['$scope', '$timeout', '$stateParams', '$ionicPopup', '$ionicLoading', '$ionicSlideBoxDelegate', 'purchaseReceiveDetailService',
	function($scope, $timeout, $stateParams, $ionicPopup, $ionicLoading, $ionicSlideBoxDelegate, purchaseReceiveDetailService) {

		$scope.from = moduleName;

		$scope.headerInfo = {};

		$scope.lineInfo = [];

		$scope.rcv_quantity = '';

		$scope.concession_quantity = '';

		$scope.concession_flag = false;


		$scope.initLoad = function() {
			purchaseReceiveDetailService.getPurchaseReceiveDetail($scope.from, $stateParams.po_location_id, $stateParams.standard_id)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.headerInfo = data.result.record.header;
						$scope.lineInfo = data.result.record.lines;
						document.getElementById('latest_standard').innerHTML = $scope.headerInfo.latest_standard;
						$ionicSlideBoxDelegate.update();
					}
					$scope.hide();
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.hide();
				})
		}

		$scope.receive = function() {
			$scope.current_rcv_quantity = 0;
			$scope.current_concession_quantity = 0;
			if (!($scope.rcv_quantity == '' || $scope.rcv_quantity == null)) {
				$scope.current_rcv_quantity = $scope.rcv_quantity;
			}
			if (!($scope.concession_quantity == '' || $scope.concession_quantity == null)) {
				$scope.current_concession_quantity = $scope.concession_quantity;
			}
			var confirmPopup = $ionicPopup.confirm({
				title: '收货确认',
				template: '物料:' + $scope.headerInfo.item_code + '&nbsp;&nbsp;' + $scope.headerInfo.item_desc + '<br/>接收数量:&nbsp;' + $scope.current_rcv_quantity + ',让步数量:&nbsp;' + $scope.current_concession_quantity + '<br/>是否确认收货?',
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
					if ($scope.rcv_quantity == '' || $scope.rcv_quantity == 0) {
						$scope.promptInfo = '接收数量不能为空或0！';
						$scope.showAlert();
					} else if ($scope.concession_flag == true && ($scope.concession_quantity == '' || $scope.concession_quantity == 0)) {
						$scope.promptInfo = '同意让步的情况下，让步数量不能为空或0！';
						$scope.showAlert();
					} else if (parseInt($scope.rcv_quantity) > parseInt($scope.headerInfo.max_receive_quantity)) {
						$scope.promptInfo = '接收数量超出可接收数量！';
						$scope.showAlert();
					} else {
						purchaseReceiveDetailService.confirmReceive($scope.from, $stateParams.po_location_id, $scope.rcv_quantity, $scope.concession_quantity)
							.success(function(data, status, headers, config) {
								if ($scope.checkResponseError(data)) {
									$scope.operatePromptReceive();
								}
							}).error(function(data, status, headers, config) {
								$scope.showNetworkError(status);
							});
					}
				} else {

				}
			});
		}

		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: '输入校验',
				template: $scope.promptInfo,
				buttons: [{
					text: '确认',
					type: 'button-positive',
					onTap: function(e) {
						return true;
					}
				}]
			});
			alertPopup.then(function(res) {

			});
		};

		$scope.operatePromptReceive = function() {
			var showPopup = $ionicPopup.show({
				title: '收货成功！'
			});
			$timeout(function() {
				showPopup.close();
				$timeout(function() {
					$scope.$ionicGoBack();
				}, 100);
			}, 1000);
		};

		//判断是否让步接收，不是时清空输入
		$scope.isConcession = function() {
			if (!$scope.concession_flag) {
				$scope.concession_quantity = '';
			}
		}

		$scope.show();

	}
]);