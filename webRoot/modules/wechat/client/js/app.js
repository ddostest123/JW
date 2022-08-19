// Ionic Starter App

var topSmile = angular.module('topSmile', ['ionic']);

topSmile.controller('topSmileRootCtrl', function($scope, $ionicLoading) {
	"$ionicLoading"

	$scope.show = function() {
		$ionicLoading.show({
			templateUrl: 'loading.html'
		});
	};
	$scope.hide = function() {
		$ionicLoading.hide();
	};
});

var dateRange = angular.module('dateRange', []);

dateRange.directive('dateFormat', ['$filter',
	function($filter) {
		var dateFilter = $filter('date');
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				function formatter(value) {
					return dateFilter(value, 'yyyy-MM-dd'); //format  
				}

				function parser() {
					return ctrl.$modelValue;
				}
				ctrl.$formatters.push(formatter);
				ctrl.$parsers.unshift(parser);
			}
		};
	}
]);

var srmApp =
	angular.module('srmApp', ['ionic', 'topSmile']).run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	}).config([
		"$stateProvider",
		"$urlRouterProvider",
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state("orderList", {
					url: '/orderList',
					templateUrl: 'html/orderList.html'
				})
				.state("asnList", {
					url: '/asnList',
					templateUrl: 'html/asnList.html'
				})
				.state("orderListDetail", {
					url: '/orderListDetail',
					templateUrl: 'html/orderListDetail.html',
					controller: 'orderDetailController',
					params: {
						item: null,
						index: null
					}
				})
				.state("asnListDetail", {
					url: '/asnListDetail',
					templateUrl: 'html/asnListDetail.html',
					controller: 'asnDetailController',
					params: {
						header_id: null
					}
				})
				.state("orderListDialog", {
					url: '/orderListDialog',
					templateUrl: 'html/orderListDialog.html'
				})
				.state("supplyTenderList", {
					url: '/supplyTenderList',
					templateUrl: 'html/supplyTenderList.html'
				})
				.state("supplyTenderListDetail", {
					url: '/supplyTenderListDetail',
					templateUrl: 'html/supplyTenderListDetail.html',
					params: {
						header_id: null
					}
				})
				.state("purchaseReceive", {
					url: '/purchaseReceive',
					templateUrl: 'html/purchaseReceive.html'
				})
				.state("purchaseReceiveDetail", {
					url: '/purchaseReceiveDetail',
					templateUrl: 'html/purchaseReceiveDetail.html'
				})
				//				.state("vendorList", {
				//					url: '/vendorList',
				//					templateUrl: 'html/vendorList.html',
				//					controller: 'vendorListController'
				//				})
				.state("messageList", {
					url: '/messageList',
					templateUrl: 'html/messageList.html'
				})
				.state("messageListDetail", {
					url: '/messageListDetail',
					templateUrl: 'html/messageListDetail.html',
					params: {
						bulletin_id: null
					}
				});

			$urlRouterProvider
				.otherwise("/orderList");

		}
	]);