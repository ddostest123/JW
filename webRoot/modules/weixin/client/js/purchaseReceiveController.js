srmApp.controller('purchaseReceiveController', ['$scope', '$timeout', '$state', '$ionicLoading', '$ionicPopup', 'purchaseReceiveService',
	function($scope, $timeout, $state, $ionicLoading, $ionicPopup, purchaseReceiveService) {

		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: 'wx46de1f9c60309f11', // 必填，企业号的唯一标识，此处填写企业号corpid
			timestamp: timestamp, // 必填，生成签名的时间戳
			nonceStr: noncestr, // 必填，生成签名的随机串
			signature: signature, // 必填，签名，见附录1
			jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});

		$scope.from = moduleName;

		$scope.listItems = [];

		$scope.pageNum = 1;

		$scope.hasMoreData = false;

		$scope.hasClickSearch = false;

		$scope.searchNumber = '';

		$scope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				if (toState.name == 'purchaseReceive' && fromState.name == 'purchaseReceiveDetail') {
					$scope.search();
				}
			});


		$scope.search = function() {
			if ($scope.searchNumber == '') {
				$scope.showAlert();
			} else {
				$scope.show();
				purchaseReceiveService.getPurchaseReceiveList(1, $scope.from, $scope.searchNumber)
					.success(function(data, status, headers, config) {
						if ($scope.checkResponseError(data)) {
							$scope.pageNum = 2;
							$scope.listItems = data.result.record;
							$scope.hasMoreData = true;
							$scope.hasClickSearch = true;
						}
						$scope.hide();
					}).error(function(data, status, headers, config) {
						$scope.showNetworkError(status);
						$scope.hide();
					});
			}
		}

		$scope.loadMore = function() {
			purchaseReceiveService.getPurchaseReceiveList($scope.pageNum, $scope.from, $scope.searchNumber)
				.success(function(data, status, headers, config) {
					if ($scope.checkResponseError(data)) {
						if (data.result.record.length > 0) {
							Array.prototype.push.apply($scope.listItems, data.result.record);
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

		$scope.scan = function() {
			//alert('timestamp:' + timestamp);
			//alert('noncestr:' + noncestr);
			//alert('signature:' + signature);
			//alert('url:' + url);
			//alert('jsapi_ticket:' + jsapi_ticket);
			wx.scanQRCode({
				desc: 'scanQRCode desc',
				needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success: function(res) {
					var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
					$scope.searchNumber = result.split(',')[1] | result.split(',')[0];
					$scope.search();
				}
			});
		};

		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: '输入校验',
				template: '请输入订单号或送货单号！',
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


		$scope.goPurchaseReceiveDetail = function(item) {
			$scope.goState('purchaseReceiveDetail', {
				po_location_id: item.po_location_id,
				standard_id: item.standard_id
			});
		};

	}
]);