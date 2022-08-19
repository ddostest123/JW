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

		$scope.from = moduleName;
		$scope.queryKeyword = '';
		$scope.listItems = [];

		$scope.color1 = 'color1';
		$scope.color2 = 'color2';

		$scope.hasLoad = false;

		$scope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				if (toState.name == 'supplyTenderList' && fromState.name == 'supplyTenderListDetail') {
					$scope.initLoad();
					//					$timeout(function() {
					//						if (fromParams.isClickSubmitButton) {
					//							$scope.operatePrompt();
					//						}
					//					}, 100);
				}
			});

		$scope.initLoad = function() {
			supplyTenderListService.getSupplyTenderList($scope.from)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.listItems = data.result.record;
						$scope.hasLoad = true;
					}
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
				})
		}

		$scope.load = function() {
			supplyTenderListService.getSupplyTenderList($scope.from)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.listItems = data.result.record;
					}
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.$broadcast('scroll.refreshComplete');
				})
		};

		//		$scope.operatePrompt = function() {
		//			var showPopup = $ionicPopup.show({
		//				title: '已提交！'
		//			});
		//			$timeout(function() {
		//				showPopup.close();
		//			}, 1000);
		//		};


		$scope.goSupplyTenderListDetail = function(item) {
			$scope.goState('supplyTenderListDetail', {
				header_id: item.entrustment_header_id,
				company_id: item.bidder_company_id
			});
		};

	}
]);