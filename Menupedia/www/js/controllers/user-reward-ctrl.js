'use strict';

angular.module('menupedia')
	.controller('UserRewardCtrl', function ($scope, Reward, Auth, $timeout, Menus, $ionicPopup) {
		//$scope.data={}
		$scope.showUsed = false;

		//tech-debt
		if (Auth.profile && Auth.profile.uid) {
			$scope.allReward = Reward.getAllRewardByUser(Auth.profile.uid, "used");
		} else {
			$timeout(function () {
				if (Auth.profile.uid)
					$scope.allReward = Reward.getAllRewardByUser(Auth.profile.uid, "used");
			}, 3000)
		}


		$scope.imgByName = Menus.image_url_by_name;
		$scope.convertTime = Reward.convertTime;

		$scope.openQRcode = function (reward) {
			var code = reward.code;
			$ionicPopup.alert({
				title: 'Your QR code of your reward',
				template: '<qr-code code="' + code + '" class="qr-code best-center"></qr-code>'
			});
		}
		
		$scope.reveal= Reward.reveal;
	});