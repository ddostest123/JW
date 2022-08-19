srmApp.controller('purchaseListController', ['$scope', '$timeout', '$state', '$ionicPopup', '$ionicModal', 'purchaseListService',
	function($scope, $timeout, $state, $ionicPopup, $ionicModal, purchaseListService) {
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

		$scope.goState = function(state, param) {
			$state.go(state, {
				header_id: param
			});
		};

		$scope.goPurchaseListDetail = function(item) {
			$scope.goState('purchaseListDetail', item.asn_header_id);
		};

		$ionicModal.fromTemplateUrl('purchaseSearch-modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.purchaseSearchModal = modal;
		});
		$scope.openPurchaseSearchModal = function() {
			$scope.purchaseSearchModal.show();
		};
		$scope.closePurchaseSearchModal = function() {
			$scope.purchaseSearchModal.hide();
		};
		$scope.confirmQuery = function() {
			$scope.purchaseSearchModal.hide();
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

		$scope.blackColor = 'blackColor';
		$scope.grayColor = 'grayColor';
		$scope.supplyModal = 'supply-modal';
		$scope.purchaseModal = 'purchase-modal';

		$scope.pageNum = 1;

		$scope.hasMoreData = true;

		$scope.initLoad = function() {
			purchaseListService.getPurchaseList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.oldListItems = data.result.record;
					$scope.listItems = purchaseListService.sortPurchaseList($scope.oldListItems);
				}).error(function(data, status, headers, config) {

				})
		}

		$scope.load = function() {
			purchaseListService.getPurchaseList(1, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.oldListItems = data.result.record;
					$scope.listItems = purchaseListService.sortPurchaseList($scope.oldListItems);
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {

				})
		};

		$scope.loadMore = function() {
			purchaseListService.getPurchaseList($scope.pageNum, $scope.from, $scope.queryItems)
				.success(function(data, status, headers, config) {
					if (data.result.record.length > 0) {
						Array.prototype.push.apply($scope.oldListItems, data.result.record);
						$scope.listItems = purchaseListService.sortPurchaseList($scope.oldListItems)
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

	}
]);