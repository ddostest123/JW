/**
 * Created by titengjiang on 15/9/8.
 */
srmApp.controller('supplyTenderListDetailController', ['$scope', '$timeout', '$stateParams', '$ionicPopup', 'supplyTenderListDetailService',

	function($scope, $timeout, $stateParams, $ionicPopup, supplyTenderListDetailService) {

		$scope.from = moduleName;

		$scope.headerInfo = {};

		$scope.lineInfo = [];

		function initLoad() {
			supplyTenderListDetailService.getSupplyTenderListDetail($scope.from, $stateParams.header_id)
				.success(function(data, status, headers, config) {
					$scope.headerInfo = data.result.record.header;
					$scope.lineInfo = data.result.record.lines;
				}).error(function(data, status, headers, config) {

				})
		}

		//confirm 对话框
		$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '确认报名',
				template: '是否确认报名?'
			});
			confirmPopup.then(function(res) {
				if (res) {
					//					supplyTenderListDetailService.confirmSupplyTenderListDetail($scope.from, $stateParams.header_id)
					//						.success(function(data, status, headers, config) {
					//							$scope.headerInfo.participation = 'Y';
					//						}).error(function(data, status, headers, config) {
					//
					//						});
					$timeout(function() {
						$scope.headerInfo.participation = 'Y';
//						$scope.headerInfo.bidding_method = 'OPEN';
//						$scope.headerInfo.approve_participation = 'N';
					}, 300);
				} else {

				}
			});
		};

		initLoad();
	}
]);