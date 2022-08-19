srmApp.controller('vendorListController', ['$scope', '$timeout', '$ionicModal', '$ionicLoading', '$ionicPopup', 'vendorListService',
	function($scope, $timeout, $ionicModal, $ionicLoading, $ionicPopup, vendorListService) {

		$scope.from = moduleName;

		$scope.vendorListItems = [];

		$scope.pageNum = 1;

		$scope.param = {
			vendor_code_name: '',
			vendor_code_name_save: ''
		};

		$scope.hasMoreVendorData = true;
		$scope.hasClickSearch = false;

		$scope.initLoadVendor = function() {
			if ($scope.param.vendor_code_name == '') {
				$scope.showAlert();
			} else {
				$scope.show();
				$scope.param.vendor_code_name_save = $scope.param.vendor_code_name;
				vendorListService.getVendorList(1, $scope.from, $scope.param.vendor_code_name_save)
					.success(function(data, status, headers, config) {
						if ($scope.checkResponseError(data)) {
							$scope.pageNum = 2;
							$scope.vendorListItems = data.result.record;
							$scope.hasClickSearch = true;
						}
						$scope.hide();
					}).error(function(data, status, headers, config) {
						$scope.showNetworkError(status);
						$scope.hide();
					})
			}
		}

		$scope.loadVendor = function() {
			vendorListService.getVendorList(1, $scope.from, $scope.param.vendor_code_name_save)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						$scope.pageNum = 2;
						$scope.vendorListItems = data.result.record;
					}
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {
					$scope.showNetworkError(status);
					$scope.$broadcast('scroll.refreshComplete');
				})
		};

		$scope.loadMoreVendor = function() {
			vendorListService.getVendorList($scope.pageNum, $scope.from, $scope.param.vendor_code_name_save)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						if (data.result.record.length > 0) {
							Array.prototype.push.apply($scope.vendorListItems, data.result.record);
							$scope.pageNum += 1;
						} else {
							$scope.hasMoreVendorData = false;
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

		//将vendor_id和vendor_code传给父Controller中的queryItems
		$scope.vendorChoose = function(item) {
			$scope.queryItems.vendor_id = item.vendor_id;
			$scope.queryItems.vendor_code = item.vendor_code;
			$scope.vendorListModal.hide();
		}

		$scope.clearVendorChoose = function() {
			$scope.queryItems.vendor_id = '';
			$scope.queryItems.vendor_code = '';
			$scope.vendorListModal.hide();
		}

		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: '输入校验',
				template: '请输入供应商编码或名称！',
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

	}
]);