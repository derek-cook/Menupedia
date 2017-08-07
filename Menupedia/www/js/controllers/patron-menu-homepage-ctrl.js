'use strict';
angular.module('menupedia')
	.controller('PatronMenuHomepageCtrl', function (
		$scope,
		$stateParams,
		Menus,
		Camera,
		$ionicActionSheet,
		$log,
		Auth,
		toastr,
		$ionicPopup,
		$timeout
	) {

		$scope.rest_id = $stateParams.restaurantId;
		$scope.restaurant = Menus.get_restaurant_by_id($scope.rest_id);
		$scope.imgdata = {};
		if ($scope.rest_id != "") {
			$scope.dish_list = Menus.allDishInRestaurant($scope.rest_id);
		}


		$scope.get_image_url = Menus.image_url_by_name;

		function linkImageAndDish(name) {
			var dishObj = {}
			dishObj.img = name;
			if ($scope.imgdata.name)
				dishObj.name = $scope.imgdata.name;
			if ($scope.imgdata.price)
				dishObj.price = $scope.imgdata.price;
			if ($scope.imgdata.description)
				dishObj.description = $scope.imgdata.description;
			dishObj.restaurantId = $scope.rest_id;
			dishObj.userId = Auth.profile.uid;
			var id = Menus.add_tempDishToRestaurant(dishObj, $scope.rest_id);
				Menus.usersaveUploadingRecord(Auth.profile.uid, id)
			}
		$scope.submitPhotoAndDetails = function () {

			// if user press twice or more it will run many times, using a flag to indicate only uploading once
			$scope.disableUpload = true;

			Menus.uploadPhoto($scope.imgdata.urldata)
				.then(linkImageAndDish)
				.then(function () {

					toastr.success("success")
					$scope.imgdata.urldata = null;
					$scope.closePopUp();
					$scope.imgdata = {}
					$timeout(function () {
						$scope.disableUpload = false;
					}, 500)
				})
				.catch(logError)
		}

		function logError(err) {
			$log.error(err);
		}

		function showPopup(urldata) {
			$scope.showInformationInput = true;
			$scope.imgdata.urldata = urldata;
			$scope.data = {};
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/partials/uploading-detail-input.html',
				title: 'Dish Detail',
				scope: $scope,
				buttons: [
					{
						text: 'Cancel'
					},
					{
						text: 'Confirm',
						type: 'button-positive',
						onTap: function (e) {
							e.preventDefault();
							if ($scope.disableUpload)
								return;
							$scope.submitPhotoAndDetails()
						}
					}]
			});
			$scope.closePopUp = function () {
				myPopup.close();
			}

		};

		$scope.showPhotoTaken = function () {
			if (!Auth.profile) {
				toastr.warning("log in to take photo")
				return;
			}
			$ionicActionSheet.show({
				buttons: [
					{
						text: 'Camera',
						onclick: function () {
							Camera.takePhotoFromCamera()
								.then(showPopup)
						}
				},
					{
						text: 'Album',
						onclick: function () {
							Camera.takePhotoFromLibrary()
								.then(showPopup)
						}
				},
					{
						text: 'Dev Mode',
						onclick: function () {
							Camera.takePhotoFromDev()
								.then(showPopup)
						}
				}
			],
				buttonClicked: function (index, button) {
					button.onclick();
					return true;
				}
			});
		};

	});
