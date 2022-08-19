srmApp.controller('vendorListController', ['$scope', '$timeout', '$ionicModal', 'vendorListService',
	function($scope, $timeout, $ionicModal, vendorListService) {

		$scope.from = moduleName;

		$scope.vendorListItems = [];

		$scope.queryKeyword = '';

		$scope.pageNum = 1;

		$scope.hasMoreVendorData = true;

		$scope.initLoadVendor = function() {
			vendorListService.getVendorList(1, $scope.from)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.vendorListItems = data.result.record;
				}).error(function(data, status, headers, config) {

				})
		}

		$scope.loadVendor = function() {
			vendorListService.getVendorList(1, $scope.from)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.vendorListItems = data.result.record;
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {

				})
		};

		$scope.loadMoreVendor = function() {
			vendorListService.getVendorList($scope.pageNum, $scope.from)
				.success(function(data, status, headers, config) {
					if (data.result.record.length > 0) {
						Array.prototype.push.apply($scope.vendorListItems, data.result.record);
						$scope.pageNum += 1;
					} else {
						$scope.hasMoreVendorData = false;
					};
					$timeout(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}, 300);
				}).error(function(data, status, headers, config) {

				})
		};

		//将vendor_id和vendor_code传给父Controller中的queryItems
		$scope.vendorChoose = function(item) {
			$scope.queryItems.vendor_id = item.vendor_id;
			$scope.queryItems.vendor_code = item.vendor_code;
			$scope.vendorListModal.hide();
		}

	}
]);