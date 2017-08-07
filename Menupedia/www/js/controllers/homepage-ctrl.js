'use strict';

angular.module('menupedia')
	.controller('HomepageCtrl', function ($scope, $state, Auth, Menus) {

		var allDishes = Menus.all_dishes();
		$scope.goToRandomDish = function() {
			var len = allDishes.length;
			var i = Math.floor(Math.random() * len);
			$state.transitionTo('app.dish_detail', { dishId: allDishes[i].$id });
		};
		$scope.openModal = Auth.loginModalOpen;
		$scope.authProfile = Auth.profile;
		$scope.signOut = Auth.signout;
		$scope.$watch(function () {
			return Auth.profile
		}, function () {
			// Usage of this watch function, I have a login and logoff button in homepage, if the auth profile is not existed, then only show log in, if already log in, just show logoff. But the auth profile is in service, service variable cannot sync to controller, have to watch the service changes. 
			// always looking for better way
			$scope.authProfile = Auth.profile;
			
			
		})
	});
