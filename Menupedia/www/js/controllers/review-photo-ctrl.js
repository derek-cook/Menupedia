'use strict';

angular.module('menupedia')
	.controller('ReviewPhotoCtrl', function ($scope, Auth, RestaurantMain, Menus, toastr, Reward) {
		$scope.data={};
		$scope.data.selectExistedDishByIndex = -1;
		$scope.data.setAsMaster = false;
		$scope.data.mysteryGift = false;

		function reset() {
			$scope.data.selectExistedDishByIndex = -1;
			$scope.data.setAsMaster = false;
			$scope.data.mysteryGift = false;
		}

		$scope.$watch(
			function () {
				return Auth.profile;
			},
			function (val) {
				if (val) {
					$scope.allPendingDish = RestaurantMain.getAllpendingDish(Auth.profile.restaurantId)
					//Above functionlists all of pending dish that have not be reviewed, 	//RestaurantMain.getAllpendingDish(Auth.profile.restaurantId,"all") will list all of the reviewed images. 
					//I dont want remove those pending dish cus we maybe can use it in the future, such as user viewing and tracking their uploading.
					$scope.getcurrentDatabaseDishes(Auth.profile.restaurantId);
				}
			});

		// $scope.dish_list ==== all of the dishes that have been saved on database
		$scope.clickCurrentDish = function () {
			if (!$scope.preSetInfor)
				return;
			
			$scope.preSetInfor.name = $scope.dish_list[$scope.data.selectExistedDishByIndex].name;
			$scope.preSetInfor.price = $scope.dish_list[$scope.data.selectExistedDishByIndex].price;
			$scope.preSetInfor.description = $scope.dish_list[$scope.data.selectExistedDishByIndex].description;
		}

		$scope.getcurrentDatabaseDishes = function (restId) {
			if (!restId)
				return;
			$scope.dish_list = Menus.allDishInRestaurant(restId);
		}

		$scope.fliping = false;

		$scope.toggle = function () {
			$scope.fliping = !$scope.fliping;
			$scope.preSetInfor = null;
		}
		$scope.get_image_url = Menus.image_url_by_name;

		$scope.selectAnImg = function (index) {
			
			$scope.selectedImgUrl = $scope.get_image_url($scope.allPendingDish[index].img);
			$scope.preSetInfor = $scope.allPendingDish[index];
			$scope.fliping = !$scope.fliping;
		}

		$scope.confirmReview = function () {
			if ($scope.preSetInfor && !$scope.preSetInfor.img) {
				toastr.error("select an image");
				return;
			}
			if (!$scope.preSetInfor.name ||
				!$scope.preSetInfor.price ||
				!$scope.preSetInfor.description
			) {
				toastr.error("Fill  out all information");
				return;
			}
			
			if ($scope.preSetInfor.reward && !$scope.data.mysteryGift) {
				Reward.createNewReward({
					user: $scope.preSetInfor.userId,
					owner: Auth.profile.restaurantId,
					description: $scope.preSetInfor.reward,
					img: $scope.preSetInfor.img
				});
				toastr.success("Add a new reward code");
			}
			if ($scope.data.mysteryGift){
				var reward = GenerateMysteryGift();
				Reward.createNewReward({
					mystery:true,
					user: $scope.preSetInfor.userId,
					owner: Auth.profile.restaurantId,
					description:reward,
					img: $scope.preSetInfor.img
				});
				toastr.success("Add a MYSTERY reward TO USER");
				
			}
			
			

			if ($scope.data.selectExistedDishByIndex != -1) {
				var pendingImg = $scope.preSetInfor.img;
				var dishId = $scope.dish_list[$scope.data.selectExistedDishByIndex].$id;
				if ($scope.data.setAsMaster) {
					var oldImg = $scope.dish_list[$scope.data.selectExistedDishByIndex].img;
					RestaurantMain.setMasterImg(dishId, pendingImg, oldImg).then(function () {
						toastr.success("set As Master Success");
						RestaurantMain.dishSetReviewed($scope.preSetInfor.$id, Auth.profile.restaurantId);
						$scope.toggle();
					});
				} else {
					RestaurantMain.updateSubImages(dishId, pendingImg).then(function () {
						toastr.success("set As SubImg Success");
						RestaurantMain.dishSetReviewed($scope.preSetInfor.$id, Auth.profile.restaurantId);
						$scope.toggle();
					});
				}
				reset();
				return;
			}
			var obj = {
				img: $scope.preSetInfor.img,
				name: $scope.preSetInfor.name,
				price: $scope.preSetInfor.price,
				description: $scope.preSetInfor.description,
				restaurantId: Auth.profile.restaurantId
			};

			RestaurantMain.addNewDishToRestaurant(obj, Auth.profile.restaurantId).then(function (data) {
				toastr.success("create to the restaurant dish " + data)
				RestaurantMain.dishSetReviewed($scope.preSetInfor.$id, Auth.profile.restaurantId);
				$scope.toggle();
			});
		}
		
		
		function GenerateMysteryGift(){
			var rate =[
				{content: "get $20 off  next visit", rate:2},
				{content: "get free dish on next meal", rate:8},
				{content: "get $3 off next visit", rate:20},
				{content: "get $2 off next visit", rate:30},
				{content: "get $1 off next visit", rate:40}
			]
			var random =  Math.floor(Math.random() * (100 - 1 + 1)) + 1;
			//alert("random is "+random);
			
			var result ="";
			var i=0;
			var cur = 0;
			for ( i in rate){
				cur = cur + rate[i].rate;
				//alert(cur);
				if ( random<= cur ){
					result = rate[i].content;
					return result;
					
				}
					
			}
			
			return "";
			
		}
	
	});