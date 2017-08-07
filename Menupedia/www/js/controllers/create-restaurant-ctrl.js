'use strict';

angular.module('menupedia')
	.controller('CreateRestCtrl', function ($scope, Auth, RestaurantMain, toastr) {

		$scope.link = 123;

		$scope.rest = {};
		$scope.rest = {
			name: "Happy Dinner",
			address: "1902 N cool cold street alpha",
			tel: "5209900909",
			ownerName: "Cook copper",
			ownerSSN: "123456",
			openHours: "Mon-Firday 10PM-9PM"

		};

		$scope.createRestaurant = function () {
			//Confuse If I should pass function or just write this whole function, cus I need get a auth.profileId, I have to fetch the profile id everytime I run this function in case if I wrote a scope to store authId, when service changes, the controller does not change. 
			var id = Auth.profile.uid;
			RestaurantMain.createRestaurant(id, $scope.rest).then(function () {
				toastr.success("Your restaurant has been updated ");
			});

		};

	});