srmApp.controller('orderListController', ['$scope', '$timeout', '$state', '$ionicPopup', '$ionicModal', '$ionicListDelegate', 'orderListService',
	function($scope, $timeout, $state, $ionicPopup, $ionicModal, $ionicListDelegate, orderListService) {

		/**
		 * 查询条件
		 */
		$scope.queryItems = {
			po_num: '',
			release_date_from: '',
			release_date_to: '',
			srm_status: '',
			vendor_id: '',
			vendor_code: '',
			only_urgent: false
		};

		$scope.goState = function(state, item, index) {
			$state.go(state, {
				item: item,
				index: index
			});
		};

		$scope.goOrderListDetail = function(item, index) {
			$scope.goState('orderListDetail', item, index);
		};

		$ionicModal.fromTemplateUrl('orderSearch-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.orderSearchModal = modal;
		});
		$scope.openOrderSearchModal = function() {
			$scope.orderSearchModal.show();
		};
		$scope.closeOrderSearchModal = function() {
			$scope.orderSearchModal.hide();
		};
		$scope.confirmQuery = function() {
			$scope.orderSearchModal.hide();
			$scope.initLoad();
		};

		$ionicModal.fromTemplateUrl('vendorList-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.vendorListModal = modal;
		});
		$scope.openVendorListModal = function() {
			$scope.vendorListModal.show();
		};
		$scope.closeVendorListModal = function() {
			$scope.vendorListModal.hide();
		};

		$scope.from = moduleName;

		$scope.listItems = [];

		$scope.oldListItems = [];

		$scope.pageNum = 1;

		$scope.color1 = 'color1';
		$scope.color2 = 'color2';
		$scope.blackColor = 'blackColor';
		$scope.grayColor = 'grayColor';
		$scope.supplyModal = 'supply-modal';
		$scope.purchaseModal = 'purchase-modal';

		$scope.hasMoreData = true;

		$scope.initLoad = function() {
			orderListService.getOrderList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.oldListItems = data.result.record;
					$scope.listItems = orderListService.sortOrderList($scope.oldListItems);
					//$scope.listItems = $scope.oldListItems;
				}).error(function(data, status, headers, config) {

				})
		}

		$scope.load = function() {
			orderListService.getOrderList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.oldListItems = data.result.record;
					$scope.listItems = orderListService.sortOrderList($scope.oldListItems);
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {

				})
		};

		$scope.loadMore = function() {
			orderListService.getOrderList($scope.pageNum, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if (data.result.record.length > 0) {
						Array.prototype.push.apply($scope.oldListItems, data.result.record);
						$scope.listItems = orderListService.sortOrderList($scope.oldListItems);
						//$scope.listItems = $scope.oldListItems;
						$scope.pageNum += 1;
					} else {
						$scope.hasMoreData = false;
					};
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}, 300);
				}).error(function(data, status, headers, config) {

				})
		};

		$scope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				if (toState.name == 'orderList' && fromState.name == 'orderListDetail') {
					$scope.listItems[fromParams.index] = fromParams.item;
				}
			});

		$scope.needConfirm = function(status) {
			if (status == '已确认') {
				return false;
			} else {
				return true;
			}
		};

		//confirm 对话框
		$scope.showConfirm = function(item) {
			var confirmPopup = $ionicPopup.confirm({
				title: '订单确认',
				template: '是否确认订单?'
			});
			confirmPopup.then(function(res) {
				if (res) {
					orderListService.confirmOrderList($scope.from, item.pur_header_id)
						.success(function(data, status, headers, config) {
							item.srm_status = '已确认';
							item.urgent_flag = 'N';
							$ionicListDelegate.closeOptionButtons();
						}).error(function(data, status, headers, config) {

						});
				} else {

				}
			});
		};
		$scope.showUrgentConfirm = function(item) {
			var confirmPopup = $ionicPopup.confirm({
				title: '整单加急',
				template: '是否确认加急?'
			});
			confirmPopup.then(function(res) {
				if (res) {
					orderListService.urgentOrderList($scope.from, item.pur_header_id)
						.success(function(data, status, headers, config) {
							item.urgent_flag = 'Y';
							$ionicListDelegate.closeOptionButtons();
						}).error(function(data, status, headers, config) {

						});
				} else {

				}
			});
		};
		$scope.showCancelUrgentConfirm = function(item) {
			var confirmPopup = $ionicPopup.confirm({
				title: '取消加急',
				template: '是否确认取消加急?'
			});
			confirmPopup.then(function(res) {
				if (res) {
					orderListService.cancelUrgentOrderList($scope.from, item.pur_header_id)
						.success(function(data, status, headers, config) {
							item.urgent_flag = 'N';
							$ionicListDelegate.closeOptionButtons();
						}).error(function(data, status, headers, config) {

						});
				} else {

				}
			});
		};
	}
]);