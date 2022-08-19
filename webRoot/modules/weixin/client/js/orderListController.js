srmApp.controller('orderListController', ['$scope', '$timeout', '$state', '$ionicPopup', '$ionicModal', '$ionicListDelegate', '$filter', 'orderListService',
	function($scope, $timeout, $state, $ionicPopup, $ionicModal, $ionicListDelegate, $filter, orderListService) {

		var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

		/**
		 * 发布日期到
		 * @type {{titleLabel: string, todayLabel: string, closeLabel: string, setLabel: string, setButtonType: string, todayButtonType: string, closeButtonType: string, inputDate: Date, mondayFirst: boolean, templateType: string, showTodayButton: string, modalHeaderColor: string, modalFooterColor: string, from: Date, to: Date, callback: Function, dateModel: string, dateFormat: string, closeOnSelect: boolean}}
		 */
		$scope.releaseDateToObject = {
			titleLabel: '日历', //Optional
			todayLabel: '今天', //Optional
			closeLabel: '关闭', //Optional
			setLabel: '确定', //Optional
			monthList: monthList, //Optional

			setButtonType: 'button-assertive', //Optional
			todayButtonType: 'button-assertive', //Optional
			closeButtonType: 'button-assertive', //Optional
			inputDate: new Date(), //Optional
			mondayFirst: true, //Optional

			templateType: 'popup', //Optional
			showTodayButton: 'true', //Optional
			modalHeaderColor: 'bar-positive', //Optional
			modalFooterColor: 'bar-positive', //Optional
			from: new Date(2012, 8, 2), //Optional
			to: new Date(2018, 8, 25), //Optional
			callback: function(val) { //Mandatory


				this.dateModel = $filter('date')(val, 'yyyy-MM-dd');

			},
			dateModel: '',
			dateFormat: 'dd-MM-yyyy', //Optional
			closeOnSelect: false //Optional
		};

		/**
		 * 日期从model
		 * @type {{titleLabel: string, todayLabel: string, closeLabel: string, setLabel: string, setButtonType: string, todayButtonType: string, closeButtonType: string, inputDate: Date, mondayFirst: boolean, templateType: string, showTodayButton: string, modalHeaderColor: string, modalFooterColor: string, from: Date, to: Date, callback: Function, dateModel: string, dateFormat: string, closeOnSelect: boolean}}
		 */
		$scope.releaseDateFromObject = {
			titleLabel: '日历', //Optional
			todayLabel: '今天', //Optional
			closeLabel: '关闭', //Optional
			setLabel: '确定', //Optional
			monthList: monthList, //Optional

			setButtonType: 'button-assertive', //Optional
			todayButtonType: 'button-assertive', //Optional
			closeButtonType: 'button-assertive', //Optional
			inputDate: new Date(), //Optional
			mondayFirst: true, //Optional

			templateType: 'popup', //Optional
			showTodayButton: 'true', //Optional
			modalHeaderColor: 'bar-positive', //Optional
			modalFooterColor: 'bar-positive', //Optional
			from: new Date(2012, 8, 2), //Optional
			to: new Date(2018, 8, 25), //Optional
			callback: function(val) { //Mandatory
				this.dateModel = $filter('date')(val, 'yyyy-MM-dd');

			},
			dateModel: '',
			dateFormat: 'dd-MM-yyyy', //Optional
			closeOnSelect: false //Optional
		};

		$scope.datepickerObject = {
			titleLabel: 'Title', //Optional
			todayLabel: 'Today', //Optional
			closeLabel: 'Close', //Optional
			setLabel: 'Set', //Optional
			setButtonType: 'button-assertive', //Optional
			todayButtonType: 'button-assertive', //Optional
			closeButtonType: 'button-assertive', //Optional
			inputDate: new Date(), //Optional
			mondayFirst: true, //Optional

			templateType: 'popup', //Optional
			showTodayButton: 'true', //Optional
			modalHeaderColor: 'bar-positive', //Optional
			modalFooterColor: 'bar-positive', //Optional
			from: new Date(2012, 8, 2), //Optional
			to: new Date(2018, 8, 25), //Optional
			callback: function(val) { //Mandatory
				this.dateModel = val;

			},
			dateModel: '',
			dateFormat: 'dd-MM-yyyy', //Optional
			closeOnSelect: false //Optional
		};

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
		$scope.hasFooter = 'has-footer';
		$scope.itemCheckbox = 'item-checkbox';

		$scope.hasMoreData = true;
		$scope.hasLoad = false;
		$scope.isShowCheckbox = false;
		$scope.hasChecked = false;


		$ionicModal.fromTemplateUrl('orderSearch-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.orderSearchModal = modal;
		});
		$ionicModal.fromTemplateUrl('vendorList-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.vendorListModal = modal;
		});

		$scope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				if (toState.name == 'orderList' && fromState.name == 'orderListDetail') {
					$scope.listItems[fromParams.index] = fromParams.item;
				}
			});

		$scope.initLoad = function() {
			$scope.queryItems.release_date_from = $scope.releaseDateFromObject.dateModel;
			$scope.queryItems.release_date_to = $scope.releaseDateToObject.dateModel;
			orderListService.getOrderList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.pageNum = 2;
						$scope.oldListItems = data.result.record;
						$scope.listItems = orderListService.sortOrderList($scope.oldListItems);
						$scope.hasLoad = true;
					}
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
				})
		}

		$scope.load = function() {
			$scope.queryItems.release_date_from = $scope.releaseDateFromObject.dateModel;
			$scope.queryItems.release_date_to = $scope.releaseDateToObject.dateModel;
			orderListService.getOrderList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.pageNum = 2;
						$scope.oldListItems = data.result.record;
						$scope.listItems = orderListService.sortOrderList($scope.oldListItems);
						$scope.isShowCheckbox = false;
						$scope.hasChecked = false;
					}
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.$broadcast('scroll.refreshComplete');
				})
		};

		$scope.loadMore = function() {
			orderListService.getOrderList($scope.pageNum, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						if (data.result.record.length > 0) {
							Array.prototype.push.apply($scope.oldListItems, data.result.record);
							$scope.listItems = orderListService.sortOrderList($scope.oldListItems);
							//$scope.listItems = $scope.oldListItems;
							$scope.pageNum += 1;
						} else {
							$scope.hasMoreData = false;
						};
					}
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}, 300);
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}, 300);
				})
		};

		//confirm 对话框
		$scope.showConfirm = function(item) {
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
					orderListService.confirmOrderList($scope.from, item.pur_header_id)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								item.srm_status = '已确认';
								item.urgent_flag = 'N';
								$ionicListDelegate.closeOptionButtons();
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
				} else {

				}
			});
		};
		$scope.showBatchConfirm = function() {
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
					var pur_headers = [];
					var mayChangeItems = [];
					for (var i = 0; i < $scope.listItems.length; i++) {
						if ($scope.listItems[i].is_checked.toString() == 'true') {
							pur_headers.push($scope.listItems[i].pur_header_id);
							mayChangeItems.push(i);
						}
					};
					orderListService.confirmOrderList($scope.from, pur_headers)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								for (var j = 0; j < mayChangeItems.length; j++) {
									$scope.listItems[mayChangeItems[j]].srm_status = '已确认';
									$scope.listItems[mayChangeItems[j]].urgent_flag = 'N';
									$scope.listItems[mayChangeItems[j]].is_checked = false;
								};
								$scope.hasChecked = false;
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
				} else {

				}
			});
		};
		$scope.showUrgentConfirm = function(item) {
			var confirmPopup = $ionicPopup.confirm({
				title: '整单加急',
				template: '是否确认加急?',
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
					orderListService.urgentOrderList($scope.from, item.pur_header_id)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								item.urgent_flag = 'Y';
								$ionicListDelegate.closeOptionButtons();
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
				} else {

				}
			});
		};
		$scope.showCancelUrgentConfirm = function(item) {
			var confirmPopup = $ionicPopup.confirm({
				title: '取消加急',
				template: '是否确认取消加急?',
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
					orderListService.cancelUrgentOrderList($scope.from, item.pur_header_id)
						.success(function(data, status, headers, config) {
							if ($scope.checkResponseError(data)) {
								item.urgent_flag = 'N';
								$ionicListDelegate.closeOptionButtons();
							}
						}).error(function(data, status, headers, config) {
							$scope.showNetworkError(status);
						});
				} else {

				}
			});
		};
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: '',
				template: '',
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

		//		$scope.operatePrompt = function() {
		//			var showPopup = $ionicPopup.show({
		//				title: '已确认！'
		//			});
		//			$timeout(function() {
		//				showPopup.close();
		//			}, 1000);
		//		};

		//		$scope.$on('$stateChangeSuccess',
		//			function(event, toState, toParams, fromState, fromParams) {
		//				if (toState.name == 'orderList' && fromState.name == 'orderListDetail') {
		//					$timeout(function() {
		//						if (fromParams.isClickButton) {
		//							$scope.operatePrompt();
		//						}
		//					}, 100);
		//				}
		//			});

		//判断是否显示多选框
		$scope.showCheckbox = function() {
			$scope.isShowCheckbox = !$scope.isShowCheckbox;
		};
		//判断是否有勾选行，如果有勾选，勾选标识返回true
		$scope.checkHasChecked = function(item) {
				$scope.hasChecked = false;
				if (item.is_checked.toString() == 'false') {
					for (var i = 0; i < $scope.listItems.length; i++) {
						if ($scope.listItems[i].is_checked.toString() == 'true') {
							$scope.hasChecked = true;
							break;
						}
					}
				} else {
					$scope.hasChecked = true;
				}
			}
			//判断是否需要确认
		$scope.needConfirm = function(status) {
			if (status == '已确认') {
				return false;
			} else {
				return true;
			}
		};

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

		$scope.openVendorListModal = function() {
			$scope.vendorListModal.show();
		};
		$scope.closeVendorListModal = function() {
			$scope.vendorListModal.hide();
		};


		$scope.goOrderListDetail = function(item, index) {
			$scope.goState('orderListDetail', {
				item: item,
				index: index
			});
		};

	}
]);