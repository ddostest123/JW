/**
 * Created by titengjiang on 15/9/8.
 */
srmApp.controller('supplyTenderListDetailController', ['$scope', '$timeout', '$stateParams', '$ionicPopup', '$ionicLoading', 'supplyTenderListDetailService',

	function($scope, $timeout, $stateParams, $ionicPopup, $ionicLoading, supplyTenderListDetailService) {

		$scope.from = moduleName;

		$scope.headerInfo = {};

		$scope.lineInfo = [];

		function initLoad() {
			supplyTenderListDetailService.getSupplyTenderListDetail($scope.from, $stateParams.header_id, $stateParams.company_id)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.headerInfo = data.result.record.header;
						$scope.lineInfo = data.result.record.lines;
					}
					$scope.hide();
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.hide();
				})
		}

		//confirm 对话框
		$scope.showParticipateConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '确认报名',
				template: '是否确认报名?',
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
					supplyTenderListDetailService.confirmSupplyTenderParticipate($scope.from, $stateParams.header_id, $stateParams.company_id)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								$scope.headerInfo.participation = 'Y';
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
				} else {

				}
			});
		}

		$scope.showSaveConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '确认保存',
				template: '是否确认保存?',
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
					var canSave = true;
					for (var i = 0; i < $scope.lineInfo.length; i++) {
						if ($scope.lineInfo[i].bid_quantity == '') {
							canSave = false;
							$scope.promptInfo = '有投标数量为空，请检查！';
							$scope.showAlert();
							break;
						}
						if ($scope.lineInfo[i].unit_price == '') {
							canSave = false;
							$scope.promptInfo = '有单价为空，请检查！';
							$scope.showAlert();
							break;
						}
						if ($scope.lineInfo[i].bid_quantity > $scope.lineInfo[i].quantity) {
							canSave = false;
							$scope.promptInfo = '有投标数量大于招标数量，请检查！';
							$scope.showAlert();
							break;
						}
					}
					if (canSave) {
						supplyTenderListDetailService.supplyTenderSave($scope.from, $scope.headerInfo.bid_header_id, $stateParams.header_id, $stateParams.company_id, $scope.lineInfo)
							.success(function(data, status, headers, config) {
								if ($scope.checkResponseError(data)) {
									initLoad();
									$scope.operatePromptSave();
								}
							}).error(function(data, status, headers, config) {
								$scope.showNetworkError(status);
							});
					}
				} else {

				}
			});
		}

		$scope.showSubmitConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '确认提交',
				template: '是否确认提交?注意!!提交之后无法进行修改!!!',
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
					supplyTenderListDetailService.supplyTenderSubmit($scope.from, $scope.headerInfo.bid_header_id)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								//$stateParams.isClickSubmitButton = true;
								$scope.operatePromptSubmit();
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
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

		$scope.operatePromptSave = function() {
			var showPopup = $ionicPopup.show({
				title: '保存成功！'
			});
			$timeout(function() {
				showPopup.close();
			}, 1000);
		};
		$scope.operatePromptSubmit = function() {
			var showPopup = $ionicPopup.show({
				title: '已提交！'
			});
			$timeout(function() {
				showPopup.close();
				$timeout(function() {
					$scope.$ionicGoBack();
				}, 100);
			}, 1000);
		};

		$scope.show();
		initLoad();
	}
]);