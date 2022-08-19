srmApp.controller('messageListController', ['$scope', '$timeout', '$state', 'messageListService',
	function($scope, $timeout, $state, messageListService) {

		$scope.from = moduleName;

		$scope.listItems = [];

		$scope.oldListItems = [];

		$scope.pageNum = 1;

		$scope.hasMoreData = true;

		$scope.goState = function(state, item) {
			$state.go(state, {
				bulletin_id: item.message_id
			});
		};

		$scope.goMessageListDetail = function(item) {
			$scope.goState('messageListDetail', item);
		};

		$scope.initLoad = function() {
			messageListService.getMessageList(1, $scope.from)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					$scope.oldListItems = data.result.record;
					$scope.listItems = messageListService.sortMessageList($scope.oldListItems);
					//$scope.listItems = $scope.oldListItems;
				}).error(function(data, status, headers, config) {

				})
		}

		$scope.load = function() {
			messageListService.getMessageList(1, $scope.from)
				.success(function(data, status, headers, config) {
					$scope.pageNum = 2;
					//$scope.oldListItems = data.result.record;
					$scope.listItems = messageListService.sortMessageList($scope.oldListItems);
					$scope.$broadcast('scroll.refreshComplete');
				}).error(function(data, status, headers, config) {

				})
		};

		$scope.loadMore = function() {
			messageListService.getMessageList($scope.pageNum, $scope.from)
				.success(function(data, status, headers, config) {
					if (data.result.record.length > 0) {
						Array.prototype.push.apply($scope.oldListItems, data.result.record);
						$scope.listItems = messageListService.sortMessageList($scope.oldListItems);
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

	}
]);