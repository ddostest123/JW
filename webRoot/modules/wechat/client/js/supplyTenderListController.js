srmApp.controller('supplyTenderListController', ['$scope', '$timeout', '$state', '$ionicPopup', '$ionicListDelegate', 'supplyTenderListService',
	function($scope, $timeout, $state, $ionicPopup, $ionicListDelegate, supplyTenderListService) {
		/**
		 * 查询条件
		 */
		$scope.queryItems = {
			po_num: '',
			release_date_from: '',
			release_date_to: '',
			srm_status: '',
			vendor_id: '',
			only_urgent: ''
		};

		$scope.goState = function(state, item) {
			$state.go(state, {
				header_id: item.entrustment_header_id,
			});
		};

		$scope.goSupplyTenderListDetail = function(item) {
			$scope.goState('supplyTenderListDetail', item);
		};

		$scope.from = moduleName;
		$scope.queryKeyword = '';
		$scope.listItems = [];

		$scope.color1 = 'color1';
		$scope.color2 = 'color2';

		$scope.initLoad = function() {
			supplyTenderListService.getSupplyTenderList($scope.from)
				.success(function(data, status, headers, config) {
					$scope.listItems = data.result.record;
				}).error(function(data, status, headers, config) {

				})
		}

		$scope.load = function() {
			supplyTenderListService.getSupplyTenderList($scope.from)
				.success(function(data, status, headers, config) {
					$scope.listItems = data.result.record;
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {

				})
		};

	}
]);