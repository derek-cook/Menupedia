'use strict';

angular.module('menupedia')
	.controller('TabCtrl', function ($scope, Auth, $state) {

		$scope.userPatronMode = true;
		$scope.profile = Auth.profile;
		$scope.$watch(function () {
			return Auth.profile
		}, function () {
			$scope.profile = Auth.profile;
		})

		$scope.switchToOwner = function () {
			$scope.userPatronMode = !$scope.userPatronMode;
			if (!$scope.userPatronMode){
				if ($scope.profile.restaurantId)
					$state.transitionTo("app.owner_main")
			} else {
				$state.transitionTo("app.homepage")
			}
		}
		$scope.login = Auth.loginModalOpen;
		$scope.logout = Auth.signout;

	});
