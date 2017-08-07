'use strict'

angular.module('menupedia')
	.controller('OwnerMainCtrl', function ($scope, toastr, Reward,Auth) {
	
		$scope.scanBarCode = function () {
			Reward.scanQRCode().then(function (code) {
				Reward.getTheReWardInfor(code,Auth.profile.restaurantId);
			}).catch(toastr.error)
		}
	});