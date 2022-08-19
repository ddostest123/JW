srmApp.controller('asnListController', ['$scope', '$timeout', '$state', '$ionicPopup', '$ionicModal', '$filter', 'asnListService',
	function($scope, $timeout, $state, $ionicPopup, $ionicModal, $filter, asnListService) {

		var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

		$scope.from = moduleName;

		$scope.listItems = [];

		$scope.oldListItems = [];

		$scope.blackColor = 'blackColor';
		$scope.grayColor = 'grayColor';
		$scope.supplyModal = 'supply-modal';
		$scope.purchaseModal = 'purchase-modal';

		$scope.pageNum = 1;

		$scope.hasMoreData = true;
		$scope.hasLoad = false;

		/**
		 * 送货日期从
		 * @type {{titleLabel: string, todayLabel: string, closeLabel: string, setLabel: string, setButtonType: string, todayButtonType: string, closeButtonType: string, inputDate: Date, mondayFirst: boolean, templateType: string, showTodayButton: string, modalHeaderColor: string, modalFooterColor: string, from: Date, to: Date, callback: Function, dateModel: string, dateFormat: string, closeOnSelect: boolean}}
		 */
		$scope.creationDateFromObject = {
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
		 * 送货日期到
		 * @type {{titleLabel: string, todayLabel: string, closeLabel: string, setLabel: string, setButtonType: string, todayButtonType: string, closeButtonType: string, inputDate: Date, mondayFirst: boolean, templateType: string, showTodayButton: string, modalHeaderColor: string, modalFooterColor: string, from: Date, to: Date, callback: Function, dateModel: string, dateFormat: string, closeOnSelect: boolean}}
		 */
		$scope.creationDateToObject = {
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
		 * 查询条件
		 */
		$scope.queryItems = {
			asn_number: '',
			creation_date_from: '',
			creation_date_to: '',
			status: '',
			vendor_id: '',
			vendor_code: ''
		};


		$ionicModal.fromTemplateUrl('asnSearch-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.asnSearchModal = modal;
		});

		$ionicModal.fromTemplateUrl('vendorList-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.vendorListModal = modal;
		});


		$scope.initLoad = function() {
			$scope.queryItems.creation_date_from = $scope.creationDateFromObject.dateModel;
			$scope.queryItems.creation_date_to = $scope.creationDateToObject.dateModel;
			asnListService.getAsnList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.pageNum = 2;
						$scope.oldListItems = data.result.record;
						$scope.listItems = asnListService.sortAsnList($scope.oldListItems);
						$scope.hasLoad = true;
					}
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
				})
		}

		$scope.load = function() {
			$scope.queryItems.creation_date_from = $scope.creationDateFromObject.dateModel;
			$scope.queryItems.creation_date_to = $scope.creationDateToObject.dateModel;
			asnListService.getAsnList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.pageNum = 2;
						$scope.oldListItems = data.result.record;
						$scope.listItems = asnListService.sortAsnList($scope.oldListItems);
					}
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.$broadcast('scroll.refreshComplete');
				})
		};

		$scope.loadMore = function() {
			asnListService.getAsnList($scope.pageNum, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						if (data.result.record.length > 0) {
							Array.prototype.push.apply($scope.oldListItems, data.result.record);
							$scope.listItems = asnListService.sortAsnList($scope.oldListItems)
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


		$scope.openAsnSearchModal = function() {
			$scope.asnSearchModal.show();
		};
		$scope.closeAsnSearchModal = function() {
			$scope.asnSearchModal.hide();
		};
		$scope.confirmQuery = function() {
			$scope.asnSearchModal.hide();
			$scope.initLoad();
		};


		$scope.openVendorListModal = function() {
			$scope.vendorListModal.show();
		};
		$scope.closeVendorListModal = function() {
			$scope.vendorListModal.hide();
		};


		$scope.goAsnListDetail = function(item) {
			$scope.goState('asnListDetail', {
				header_id: item.asn_header_id
			});
		};

	}
]);