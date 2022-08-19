var srmApp =
	angular.module('srmApp', ['ionic', 'ngIOS9UIWebViewPatch', 'ionic-datepicker']).run(['$ionicPlatform',
		function($ionicPlatform) {
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
		}
	]).config([

		"$stateProvider",
		"$urlRouterProvider",
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state("orderList", {
					url: '/orderList',
					templateUrl: 'templates/orderList.html'
				})
				.state("asnList", {
					url: '/asnList',
					templateUrl: 'templates/asnList.html'
				})
				.state("orderListDetail", {
					url: '/orderListDetail',
					templateUrl: 'templates/orderListDetail.html',
					controller: 'orderDetailController',
					params: {
						item: null,
						index: null
					}
				})
				.state("asnListDetail", {
					url: '/asnListDetail',
					templateUrl: 'templates/asnListDetail.html',
					controller: 'asnDetailController',
					params: {
						header_id: null
					}
				})
				.state("supplyTenderList", {
					url: '/supplyTenderList',
					templateUrl: 'templates/supplyTenderList.html'
				})
				.state("supplyTenderListDetail", {
					url: '/supplyTenderListDetail',
					templateUrl: 'templates/supplyTenderListDetail.html',
					params: {
						header_id: null,
						company_id: null
					}
				})
				.state("purchaseReceive", {
					url: '/purchaseReceive',
					templateUrl: 'templates/purchaseReceive.html'
				})
				.state("purchaseReceiveDetail", {
					url: '/purchaseReceiveDetail',
					templateUrl: 'templates/purchaseReceiveDetail.html',
					params: {
						po_location_id: null,
						standard_id: null
					}
				})
				//				.state("vendorList", {
				//					url: '/vendorList',
				//					templateUrl: 'templates/vendorList.html',
				//					controller: 'vendorListController'
				//				})
				.state("messageList", {
					url: '/messageList',
					templateUrl: 'templates/messageList.html'
				})
				.state("messageListDetail", {
					url: '/messageListDetail',
					templateUrl: 'templates/messageListDetail.html',
					params: {
						bulletin_id: null
					}
				});

			//	$urlRouterProvider
			//		.otherwise("/orderList");

		}
	]).controller('rootController', ['$scope', '$state', '$ionicLoading', '$ionicPopup',
		function($scope, $state, $ionicLoading, $ionicPopup) {

			function showAlert(content) {
				$ionicPopup.alert({
					title: '错误',
					template: content,
					buttons: [{
						text: '确认',
						type: 'button-positive',
						onTap: function(e) {
							return true;
						}
					}]
				});
			}

			$scope.show = function() {
				$ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					showBackdrop: true,
					maxWidth: 200,
					showDelay: 0
				});
			};
			$scope.hide = function() {
				$ionicLoading.hide();
			};

			$scope.goState = function(state, param) {
				$state.go(state, param);
			};

			$scope.showNetworkError = function(status) {
				switch (status) {
					case 0:
						showAlert("请检查网络");
						break;
					case 404:
						showAlert("无法访问服务器资源");
						break;
					default:
						showAlert("通信异常");
				}
			}

			$scope.checkResponseError = function(data) {
				if (!data.success) {
					showAlert(data.error.message);
					return false;
				}
				return true
			}

		}

	]);